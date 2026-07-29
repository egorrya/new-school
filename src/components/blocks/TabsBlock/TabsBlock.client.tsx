"use client"

import type React from 'react'

import { LayoutGroup, motion, motionValue, useReducedMotion, type MotionValue } from 'motion/react'
import { Children, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { cn } from '@/utilities/ui'

import { TabsNav } from './TabsNav.client'

type TabsBlockTab = {
  id: string
  title: string
}

type TabsBlockClientProps = {
  children: React.ReactNode
  className?: string
  panelContainerClassName?: string
  tabs: TabsBlockTab[]
}

type PanelMotionValues = {
  opacity: MotionValue<number>
  y: MotionValue<number>
  blur: MotionValue<string>
}

const SCROLL_ACTIVATION_OFFSET_PX = 25
const SCROLL_TARGET_GAP_PX = 32
const PANEL_FADE_ZONE_PX = 480
// Extra scroll distance the next panel must cover before it starts fading the current one out,
// so the current tab stays fully visible longer after it has appeared.
const PANEL_EXIT_HOLD_PX = 400

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value))
}

function getFixedHeaderBottom(rootStyles: CSSStyleDeclaration, rootFontSize: number) {
  const fixedBottomRaw = rootStyles.getPropertyValue('--site-header-fixed-bottom').trim()
  const fixedBottom = Number.parseFloat(fixedBottomRaw)

  if (Number.isFinite(fixedBottom) && fixedBottom > 0) {
    return fixedBottom
  }

  return (Number.parseFloat(rootStyles.getPropertyValue('--site-header-height')) || 0) * rootFontSize
}

function getTabsNavHeight(rootStyles: CSSStyleDeclaration) {
  const tabsNavHeight = Number.parseFloat(
    rootStyles.getPropertyValue('--site-tabs-nav-height').trim(),
  )

  return Number.isFinite(tabsNavHeight) ? tabsNavHeight : 0
}

function getTabsScrollOffset(extraGap = 0) {
  const rootStyles = window.getComputedStyle(document.documentElement)
  const rootFontSize = Number.parseFloat(rootStyles.fontSize) || 16

  return getFixedHeaderBottom(rootStyles, rootFontSize) + getTabsNavHeight(rootStyles) + extraGap
}

export function TabsBlockClient({
  children,
  className,
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
        blur: motionValue('blur(2px)'),
      })
    })

    return valuesById
  }, [tabs])

  const getPanelMotion = useCallback(
    (id: string) =>
      panelMotionById.get(id) ?? {
        opacity: motionValue(0),
        y: motionValue(10),
        blur: motionValue('blur(2px)'),
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

    const updatePanelProgress = (activationLine: number, tops: Array<number | null>) => {
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
          motionValues.blur.set('blur(0px)')
          return
        }

        let progress = clamp01((activationLine + PANEL_FADE_ZONE_PX - top) / PANEL_FADE_ZONE_PX)
        const nextTop = tops[index + 1]

        if (typeof nextTop === 'number') {
          const nextProgress = clamp01(
            (activationLine + PANEL_FADE_ZONE_PX - (nextTop + PANEL_EXIT_HOLD_PX)) / PANEL_FADE_ZONE_PX,
          )
          progress = clamp01(progress - nextProgress)
        }

        motionValues.opacity.set(progress)
        motionValues.y.set((1 - progress) * 10)
        motionValues.blur.set(`blur(${((1 - progress) * 2).toFixed(2)}px)`)
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

      updatePanelProgress(activationLine, tops)

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

    const section = document.getElementById(nextId)

    if (section) {
      window.scrollTo({
        behavior: shouldReduceMotion ? 'auto' : 'smooth',
        top: Math.max(
          0,
          section.getBoundingClientRect().top +
            window.scrollY -
            getTabsScrollOffset(SCROLL_TARGET_GAP_PX),
        ),
      })
    }

    unlockScrollSyncTimeoutRef.current = window.setTimeout(() => {
      isProgrammaticScrollRef.current = false
      unlockScrollSyncTimeoutRef.current = null
      window.dispatchEvent(new Event('scroll'))
    }, shouldReduceMotion ? 0 : 650)
  }

  if (tabs.length === 0 || panels.length === 0) {
    return null
  }

  return (
    <LayoutGroup id="tabs-block">
      <div className={cn('space-y-8', className)}>
        <TabsNav
          activeId={activeTab?.id ?? tabs[0].id}
          onTabChange={handleTabChange}
          tabs={tabs}
        />

        <div className={cn('space-y-8 sm:pt-4 lg:pt-8', panelContainerClassName)}>
          {panels.map((panel, index) => {
            const tab = tabs[index]

            if (!tab) {
              return null
            }

            const isActive = tab.id === activeId
            const motionValues = getPanelMotion(tab.id)

            return (
              <motion.div
                aria-hidden={!isActive}
                className="mt-3 w-full will-change-[transform,opacity,filter] sm:mt-4 first:mt-0"
                style={{
                  opacity: motionValues.opacity,
                  y: motionValues.y,
                  filter: motionValues.blur,
                  pointerEvents: isActive ? 'auto' : 'none',
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
