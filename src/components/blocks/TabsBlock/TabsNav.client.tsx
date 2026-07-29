"use client"

import Link from 'next/link'
import { type MouseEvent, useLayoutEffect, useRef } from 'react'
import { LayoutGroup, motion, useReducedMotion } from 'motion/react'

import { cn } from '@/utilities/ui'

type TabsNavItem = {
  id: string
  title: string
}

type TabsNavProps = {
  activeId: string
  className?: string
  onTabChange: (id: string) => void
  tabs: TabsNavItem[]
}

export function TabsNav({ activeId, className, onTabChange, tabs }: TabsNavProps) {
  const shouldReduceMotion = useReducedMotion() ?? false
  const navRef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    const nav = navRef.current

    if (!nav) {
      document.documentElement.style.setProperty('--site-tabs-nav-height', '0px')
      return
    }

    const updateHeight = () => {
      document.documentElement.style.setProperty('--site-tabs-nav-height', `${nav.offsetHeight}px`)
    }

    updateHeight()

    const resizeObserver = new ResizeObserver(() => {
      updateHeight()
      window.requestAnimationFrame(() => {
        window.dispatchEvent(new Event('scroll'))
      })
    })

    resizeObserver.observe(nav)

    return () => {
      resizeObserver.disconnect()
      document.documentElement.style.setProperty('--site-tabs-nav-height', '0px')
    }
  }, [])

  if (tabs.length === 0) {
    return null
  }

  const handleTabClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return
    }

    event.preventDefault()
    onTabChange(id)
  }

  return (
    <LayoutGroup id="tabs-nav">
      <motion.div
        ref={navRef}
        className={cn(
          'sticky z-30 mx-auto flex w-full justify-center',
          className,
        )}
        animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }}
        initial={shouldReduceMotion ? false : { opacity: 0, y: -8, filter: 'blur(2px)' }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        style={{ top: 'calc(var(--site-header-fixed-bottom, var(--site-header-height, 0px)) + 0.25rem)' }}
      >
        <div className="inline-flex max-w-full overflow-x-auto rounded-full border-2 border-foreground bg-background p-1.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <nav aria-label="Вкладки" className="inline-flex min-w-max items-center gap-1.5">
            {tabs.map((tab) => {
              const isActive = tab.id === activeId

              return (
                <Link
                  key={tab.id}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'relative inline-flex shrink-0 items-center justify-center rounded-full px-5 py-3 text-sm font-medium leading-none transition-colors duration-300 ease-out sm:px-7 sm:py-3.5 sm:text-base',
                    isActive ? 'text-white' : 'text-foreground',
                  )}
                  href={`#${tab.id}`}
                  onClick={(event) => handleTabClick(event, tab.id)}
                >
                  {isActive ? (
                    <motion.span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full bg-foreground"
                      layoutId="tabs-active-pill"
                      transition={{ type: 'spring', stiffness: 520, damping: 38, mass: 0.75 }}
                    />
                  ) : null}
                  <span className="relative z-10 whitespace-nowrap tracking-[0.02em]">
                    {tab.title}
                  </span>
                </Link>
              )
            })}
          </nav>
        </div>
      </motion.div>
    </LayoutGroup>
  )
}
