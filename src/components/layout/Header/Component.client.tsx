'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useLayoutEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

import type { Header, SiteSetting } from '@/payload-types'

import { Logo } from '@/components/shared/Logo/Logo'
import {
  HeaderNavActions,
  HeaderNavLinks,
  SecondaryHeaderLinks,
  headerNavigationItemDelayStep,
  headerNavigationItemRevealDuration,
} from './Nav'
import { cn } from '@/utilities/ui'

interface HeaderClientProps {
  header: Header
  siteSettings?: SiteSetting
}

const HEADER_MINI_SCROLL_THRESHOLD = 32
const MOBILE_HEADER_MEDIA_QUERY = '(width < 40rem)'

const headerShellClassName =
  'relative overflow-visible rounded-base border shadow-none transition-[border-color,background-color] duration-300 ease-out'
const headerRowClassName =
  'relative flex items-center justify-between gap-3 px-3 transition-[padding] duration-300 ease-out sm:gap-4 sm:px-6 lg:gap-6'
const headerLogoClassName =
  'inline-flex shrink-0 items-center transition-[height] duration-[560ms] ease-[cubic-bezier(0.22,1,0.36,1)]'
const headerNavClassName =
  'pointer-events-none absolute left-1/2 hidden -translate-x-1/2 min-[900px]:flex'
const headerNavRevealDelay = 0.88
const headerActionsRevealGap = 0.14
const headerPositionTransitionDuration = 700

export const HeaderClient: React.FC<HeaderClientProps> = ({ header, siteSettings }) => {
  const pathname = usePathname()
  const [isMiniHeader, setIsMiniHeader] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const shouldReduceMotion = useReducedMotion() ?? false
  const shellRef = useRef<HTMLDivElement | null>(null)
  const rowRef = useRef<HTMLDivElement | null>(null)
  const logoRef = useRef<HTMLDivElement | null>(null)
  const navRef = useRef<HTMLDivElement | null>(null)
  const actionsRef = useRef<HTMLDivElement | null>(null)
  const fixedHeaderRef = useRef<HTMLElement | null>(null)
  const secondaryHeaderRef = useRef<HTMLDivElement | null>(null)
  const applyScrollStateRef = useRef<(() => void) | null>(null)
  const showSecondaryHeader = Boolean(header.showSecondaryHeader)
  const navigationItemCount = header.navigationLinks?.length ?? 0
  const headerActionsRevealDelay =
    navigationItemCount > 0
      ? headerNavRevealDelay +
        (navigationItemCount - 1) * headerNavigationItemDelayStep +
        headerNavigationItemRevealDuration +
        headerActionsRevealGap
      : 0.7

  useLayoutEffect(() => {
    let scrollRaf = 0
    const mobileHeaderQuery = window.matchMedia(MOBILE_HEADER_MEDIA_QUERY)

    const applyScrollState = () => {
      const scrollY = window.scrollY
      const isMobileHeader = mobileHeaderQuery.matches
      const nextIsMiniHeader = isMobileHeader || scrollY > HEADER_MINI_SCROLL_THRESHOLD

      setIsMiniHeader((current) => (current === nextIsMiniHeader ? current : nextIsMiniHeader))
    }
    applyScrollStateRef.current = applyScrollState

    const scheduleScrollState = () => {
      if (scrollRaf !== 0) {
        return
      }

      scrollRaf = window.requestAnimationFrame(() => {
        scrollRaf = 0
        applyScrollState()
      })
    }

    applyScrollState()
    window.addEventListener('scroll', scheduleScrollState, { passive: true })
    mobileHeaderQuery.addEventListener('change', applyScrollState)

    return () => {
      applyScrollStateRef.current = null
      window.removeEventListener('scroll', scheduleScrollState)
      mobileHeaderQuery.removeEventListener('change', applyScrollState)
      if (scrollRaf !== 0) {
        window.cancelAnimationFrame(scrollRaf)
      }
    }
  }, [])

  useLayoutEffect(() => {
    applyScrollStateRef.current?.()
  }, [isMiniHeader, pathname])

  useLayoutEffect(() => {
    const fixedHeader = fixedHeaderRef.current

    if (!fixedHeader) {
      return
    }

    let frame = 0
    let transitionTimer = 0

    const updateFixedHeaderBottom = () => {
      document.documentElement.style.setProperty(
        '--site-header-fixed-bottom',
        `${fixedHeader.getBoundingClientRect().bottom}px`,
      )
    }

    frame = window.requestAnimationFrame(updateFixedHeaderBottom)
    transitionTimer = window.setTimeout(updateFixedHeaderBottom, headerPositionTransitionDuration + 80)
    window.addEventListener('resize', updateFixedHeaderBottom)

    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(transitionTimer)
      window.removeEventListener('resize', updateFixedHeaderBottom)
    }
  }, [isMiniHeader, showSecondaryHeader])

  useLayoutEffect(() => {
    const secondaryHeader = secondaryHeaderRef.current

    if (!secondaryHeader) {
      document.documentElement.style.setProperty('--site-secondary-header-height', '0px')
      document.documentElement.style.setProperty(
        '--site-header-fixed-bottom',
        'var(--site-header-height)',
      )
      applyScrollStateRef.current?.()
      return
    }

    const updateHeight = () => {
      const height = secondaryHeader.offsetHeight
      document.documentElement.style.setProperty('--site-secondary-header-height', `${height}px`)
      document.documentElement.style.setProperty(
        '--site-header-fixed-bottom',
        `calc(var(--site-header-height) + ${height}px)`,
      )
    }

    updateHeight()

    const resizeObserver = new ResizeObserver(updateHeight)
    resizeObserver.observe(secondaryHeader)

    return () => {
      resizeObserver.disconnect()
    }
  }, [showSecondaryHeader])

  return (
    <>
      {showSecondaryHeader ? (
        <div
          ref={secondaryHeaderRef}
          className={cn(
            'fixed inset-x-0 top-0 z-80 bg-black text-white transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform',
            isMiniHeader ? 'pointer-events-none -translate-y-full' : 'translate-y-0',
          )}
        >
          <SecondaryHeaderLinks header={header} siteSettings={siteSettings} />
        </div>
      ) : null}
      <header
        ref={fixedHeaderRef}
        className={cn(
          'container fixed inset-x-0 pt-(--site-header-top-offset) transition-[top] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
          menuOpen ? 'z-90' : 'z-70',
        )}
        style={{ top: isMiniHeader ? 0 : 'var(--site-secondary-header-height, 0px)' }}
        suppressHydrationWarning
      >
        <motion.div
          ref={shellRef}
          className={cn(
            headerShellClassName,
            isMiniHeader ? 'border-border bg-white' : 'border-transparent bg-transparent',
          )}
          initial={shouldReduceMotion ? false : { opacity: 0, y: -10 }}
          transition={{ delay: 0.12, duration: 0.72, ease: 'easeOut' }}
          viewport={{ amount: 0.1, once: true }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          style={shouldReduceMotion ? undefined : { willChange: 'transform, opacity' }}
        >
          <motion.div
            ref={rowRef}
            data-header-state={isMiniHeader ? 'compact' : 'expanded'}
            className={cn(
              headerRowClassName,
              isMiniHeader ? 'py-1.5 sm:py-4' : 'py-0.5 sm:py-1 lg:py-1.5',
            )}
            initial={shouldReduceMotion ? false : { opacity: 0, y: -10 }}
            transition={{ delay: 0.36, duration: 0.62, ease: 'easeOut' }}
            viewport={{ amount: 0.1, once: true }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            style={shouldReduceMotion ? undefined : { willChange: 'transform, opacity' }}
          >
            <motion.div
              ref={logoRef}
              className={cn(headerLogoClassName)}
              initial={shouldReduceMotion ? false : { opacity: 0, y: -10 }}
              transition={{ delay: 0.62, duration: 0.55, ease: 'easeOut' }}
              viewport={{ amount: 0.1, once: true }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              style={{
                height: isMiniHeader
                  ? 'var(--site-header-logo-height)'
                  : 'var(--site-header-logo-height-expanded)',
                ...(shouldReduceMotion ? undefined : { willChange: 'transform, opacity' }),
              }}
            >
              <Link
                aria-label={siteSettings?.siteName || 'Новая школа'}
                className="flex h-full origin-center items-center transition-transform duration-200 ease-out hover:scale-105 focus-visible:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:focus-visible:scale-100"
                href="/"
              >
                <Logo
                  className="h-full"
                  compactLogo={siteSettings?.logoImageCompact ?? null}
                  logo={siteSettings?.logoImage ?? null}
                  logoType={siteSettings?.logoType ?? null}
                  sizeVariant="header"
                  siteName={siteSettings?.siteName}
                  state={isMiniHeader ? 'compact' : 'expanded'}
                />
              </Link>
            </motion.div>

            <div ref={navRef} className={cn(headerNavClassName)}>
              <HeaderNavLinks header={header} revealDelay={headerNavRevealDelay} />
            </div>

            <div ref={actionsRef} className="ml-auto">
              <HeaderNavActions
                header={header}
                hideSocialLinks={showSecondaryHeader}
                menuOpen={menuOpen}
                onMenuOpenChange={setMenuOpen}
                revealDelay={headerActionsRevealDelay}
                siteSettings={siteSettings}
              />
            </div>
          </motion.div>
        </motion.div>
      </header>
    </>
  )
}
