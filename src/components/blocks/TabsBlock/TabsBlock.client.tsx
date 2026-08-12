"use client"

import type React from 'react'

import { LayoutGroup, motion, motionValue, useReducedMotion, type MotionValue } from 'motion/react'
import { Children, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { getTabsScrollOffset, scrollToTabSection } from '@/utilities/scrollToTabSection'
import { cn } from '@/utilities/ui'

import { TabsNav } from './TabsNav.client'

type TabsBlockTab = {
  id: string
  title: string
}

type TabsBlockClientProps = {
  children: React.ReactNode
  className?: string
  hideNavigation?: boolean
  panelContainerClassName?: string
  tabs: TabsBlockTab[]
}

type PanelMotionValues = {
  opacity: MotionValue<number>
  y: MotionValue<number>
}

const SCROLL_ACTIVATION_OFFSET_PX = 25
// A panel's opacity depends only on how far its own top has scrolled into the viewport
// (not on its neighbors), so short panels always reach full opacity once comfortably in view.
// Panels stay fully invisible while still near the bottom edge of the viewport — fade only
// starts once a panel's top has already scrolled this far up (as a fraction of viewport height).
const PANEL_REVEAL_START_VIEWPORT_RATIO = 0.85
// ...and finishes quickly after that, once its top reaches this fraction of the viewport height.
const PANEL_REVEAL_END_VIEWPORT_RATIO = 0.62

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value))
}

export function TabsBlockClient({
  children,
  className,
  hideNavigation = false,
  panelContainerClassName,
  tabs,
}: TabsBlockClientProps) {
  const shouldReduceMotion = useReducedMotion() ?? false
  const panels = useMemo(() => Children.toArray(children), [children])
  const [activeId, setActiveId] = useState(tabs[0]?.id ?? '')
  const activeIdRef = useRef(activeId)
  const isProgrammaticScrollRef = useRef(false)
  const unlockScrollSyncTimeoutRef = useRef<number | null>(null)
  const panelMotionById = useMemo(() => {
    const valuesById = new Map<string, PanelMotionValues>()

    tabs.forEach((tab) => {
      valuesById.set(tab.id, {
        opacity: motionValue(0),
        y: motionValue(10),
      })
    })

    return valuesById
  }, [tabs])

  const getPanelMotion = useCallback(
    (id: string) =>
      panelMotionById.get(id) ?? {
        opacity: motionValue(0),
        y: motionValue(10),
      },
    [panelMotionById],
  )

  useEffect(() => {
    activeIdRef.current = activeId
  }, [activeId])

  const activeIndex = Math.max(
    0,
    tabs.findIndex((tab) => tab.id === activeId),
  )
  const activeTab = tabs[activeIndex] ?? tabs[0]

  useEffect(() => {
    if (tabs.length === 0) {
      return
    }

    const getActivationLine = () => {
      return getTabsScrollOffset(16 + SCROLL_ACTIVATION_OFFSET_PX)
    }

    const updatePanelProgress = (tops: Array<number | null>) => {
      const viewportHeight = window.innerHeight
      const revealStart = viewportHeight * PANEL_REVEAL_START_VIEWPORT_RATIO
      const revealRange = Math.max(
        1,
        revealStart - viewportHeight * PANEL_REVEAL_END_VIEWPORT_RATIO,
      )

      tabs.forEach((tab, index) => {
        const top = tops[index]
        const motionValues = getPanelMotion(tab.id)

        if (top === null) {
          return
        }

        if (shouldReduceMotion) {
          const progress = tab.id === activeIdRef.current ? 1 : 0
          motionValues.opacity.set(progress)
          motionValues.y.set(0)
          return
        }

        const progress = clamp01((revealStart - top) / revealRange)

        motionValues.opacity.set(progress)
        motionValues.y.set((1 - progress) * 10)
      })
    }

    const syncFromScroll = () => {
      const activationLine = getActivationLine()
      let nextActiveId = tabs[0]?.id ?? ''
      const tops = tabs.map((tab) => {
        const section = document.getElementById(tab.id)

        return section instanceof HTMLElement ? section.getBoundingClientRect().top : null
      })

      tops.forEach((top, index) => {
        if (top !== null && top <= activationLine) {
          nextActiveId = tabs[index]?.id ?? nextActiveId
        }
      })

      updatePanelProgress(tops)

      if (isProgrammaticScrollRef.current) {
        return
      }

      if (nextActiveId && nextActiveId !== activeIdRef.current) {
        setActiveId(nextActiveId)
      }
    }

    let scrollRaf = 0

    const scheduleSync = () => {
      if (scrollRaf !== 0) {
        return
      }

      scrollRaf = window.requestAnimationFrame(() => {
        scrollRaf = 0
        syncFromScroll()
      })
    }

    const syncFromHash = () => {
      const hash = window.location.hash.slice(1)
      const nextActiveIndex = tabs.findIndex((tab) => tab.id === hash)
      const nextActiveId = nextActiveIndex >= 0 ? tabs[nextActiveIndex]?.id ?? '' : tabs[0]?.id ?? ''

      if (!nextActiveId) {
        return
      }

      setActiveId((current) => (current === nextActiveId ? current : nextActiveId))
    }

    syncFromHash()
    syncFromScroll()
    window.addEventListener('scroll', scheduleSync, { passive: true })
    window.addEventListener('resize', scheduleSync)
    window.addEventListener('hashchange', syncFromHash)

    return () => {
      window.removeEventListener('scroll', scheduleSync)
      window.removeEventListener('resize', scheduleSync)
      window.removeEventListener('hashchange', syncFromHash)

      if (scrollRaf !== 0) {
        window.cancelAnimationFrame(scrollRaf)
      }

      if (unlockScrollSyncTimeoutRef.current !== null) {
        window.clearTimeout(unlockScrollSyncTimeoutRef.current)
      }
    }
  }, [getPanelMotion, tabs, shouldReduceMotion])

  const handleTabChange = (nextId: string) => {
    if (!nextId || nextId === activeId) {
      return
    }

    setActiveId(nextId)
    window.history.pushState(null, '', `#${nextId}`)

    isProgrammaticScrollRef.current = true

    if (unlockScrollSyncTimeoutRef.current !== null) {
      window.clearTimeout(unlockScrollSyncTimeoutRef.current)
    }

    scrollToTabSection(nextId, shouldReduceMotion)

    unlockScrollSyncTimeoutRef.current = window.setTimeout(() => {
      isProgrammaticScrollRef.current = false
      unlockScrollSyncTimeoutRef.current = null
      window.dispatchEvent(new Event('scroll'))
    }, shouldReduceMotion ? 0 : 650)
  }

  useEffect(() => {
    if (!hideNavigation) {
      return
    }

    document.documentElement.style.setProperty('--site-tabs-nav-height', '0px')
  }, [hideNavigation])

  if (tabs.length === 0 || panels.length === 0) {
    return null
  }

  return (
    <LayoutGroup id="tabs-block">
      <div className={cn('space-y-8', className)}>
        {hideNavigation ? null : (
          <TabsNav
            activeId={activeTab?.id ?? tabs[0].id}
            onTabChange={handleTabChange}
            tabs={tabs}
          />
        )}

        <div className={cn('space-y-8 sm:pt-4 lg:pt-8', panelContainerClassName)}>
          {panels.map((panel, index) => {
            const tab = tabs[index]

            if (!tab) {
              return null
            }

            const motionValues = getPanelMotion(tab.id)

            return (
              <motion.div
                className="mt-12 w-full will-change-[transform,opacity] sm:mt-16 first:mt-0"
                style={{
                  opacity: motionValues.opacity,
                  y: motionValues.y,
                }}
                key={tab.id}
              >
                {panel}
              </motion.div>
            )
          })}
        </div>
      </div>
    </LayoutGroup>
  )
}
