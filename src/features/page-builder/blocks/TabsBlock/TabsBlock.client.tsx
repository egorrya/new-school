"use client"

import type React from 'react'

import { useReducedMotion } from 'motion/react'
import { Children, useEffect, useMemo, useRef, useState } from 'react'

import { getTabsScrollOffset, scrollToTabSection } from '@/shared/lib/scrollToTabSection'
import { cn } from '@/shared/lib/cn'

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

const SCROLL_ACTIVATION_OFFSET_PX = 25

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
  }, [tabs])

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
    <div className={cn('space-y-6', className)}>
      {hideNavigation ? null : (
        <TabsNav
          activeId={activeTab?.id ?? tabs[0].id}
          onTabChange={handleTabChange}
          tabs={tabs}
        />
      )}

      <div className={cn('space-y-6', panelContainerClassName)}>
        {panels.map((panel, index) => {
          const tab = tabs[index]

          if (!tab) {
            return null
          }

          return (
            <div className="w-full" key={tab.id}>
              {panel}
            </div>
          )
        })}
      </div>
    </div>
  )
}
