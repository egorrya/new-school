'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useLayoutEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

import type { Header, SiteSetting } from '@/payload-types'

import { Logo } from '@/components/shared/Logo/Logo'
import { HeaderNavActions, HeaderNavLinks, SecondaryHeaderLinks } from './Nav'
import { cn } from '@/utilities/ui'

interface HeaderClientProps {
  header: Header
  siteSettings?: SiteSetting
}

const HEADER_SCROLL_BORDER_DISTANCE = 140
const HEADER_SCROLL_BACKGROUND_DISTANCE = 220
const HEADER_SCROLL_LOGO_DISTANCE = 140
const MOBILE_HEADER_MEDIA_QUERY = '(width < 40rem)'

const headerShellClassName =
  'relative overflow-visible rounded-base border-2 border-transparent bg-transparent shadow-none'
const headerRowClassName =
  'flex items-center justify-between gap-3 px-3 py-1.5 sm:gap-4 sm:px-6 sm:py-4 lg:gap-6'
const headerLogoClassName = 'inline-flex shrink-0 items-center'
// Height is tied directly to scroll position (see applyScrollState) instead of a
// threshold-triggered CSS transition, so it shrinks in lockstep with the scroll
// gesture at any speed instead of racing through a fixed-duration animation.
const headerLogoHeightStyle = {
  height:
    'calc(var(--site-header-logo-height-expanded) - (var(--site-header-logo-height-expanded) - var(--site-header-logo-height)) * var(--site-header-logo-progress, 0))',
} as const
const headerNavClassName = 'hidden'
const headerNavRevealDelay = 0.88
const headerActionsRevealDelay = 0.7

export const HeaderClient: React.FC<HeaderClientProps> = ({ header, siteSettings }) => {
  const pathname = usePathname()
  const [logoState, setLogoState] = useState<'expanded' | 'compact'>('expanded')
  const [menuOpen, setMenuOpen] = useState(false)
  const shouldReduceMotion = useReducedMotion() ?? false
  const shellRef = useRef<HTMLDivElement | null>(null)
  const rowRef = useRef<HTMLDivElement | null>(null)
  const logoRef = useRef<HTMLDivElement | null>(null)
  const navRef = useRef<HTMLDivElement | null>(null)
  const actionsRef = useRef<HTMLDivElement | null>(null)
  const fixedHeaderRef = useRef<HTMLElement | null>(null)
  const secondaryHeaderRef = useRef<HTMLDivElement | null>(null)
  const secondaryHeaderHeightRef = useRef(0)
  const applyScrollStateRef = useRef<(() => void) | null>(null)
  const hasSecondaryLinks = header.showSecondaryHeader && (header.secondaryHeaderLinks?.length ?? 0) > 0

  useLayoutEffect(() => {
    const shell = shellRef.current
    const row = rowRef.current
    const logo = logoRef.current
    const nav = navRef.current
    const actions = actionsRef.current

    if (!shell || !row || !logo || !nav || !actions) {
      return
    }

    let scrollRaf = 0
    const mobileHeaderQuery = window.matchMedia(MOBILE_HEADER_MEDIA_QUERY)

    const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1)
    const smoothStep = (value: number) => value * value * (3 - 2 * value)

    shell.style.transitionProperty = 'border-color, background-color'
    shell.style.transitionDuration = '180ms'
    shell.style.transitionTimingFunction = 'linear'

    const applyScrollState = () => {
      const scrollY = window.scrollY
      const isMobileHeader = mobileHeaderQuery.matches
      const borderProgress = isMobileHeader
        ? 1
        : smoothStep(clamp01(scrollY / HEADER_SCROLL_BORDER_DISTANCE))
      const backgroundProgress = isMobileHeader
        ? 1
        : smoothStep(clamp01(scrollY / HEADER_SCROLL_BACKGROUND_DISTANCE))
      const logoProgress = isMobileHeader
        ? 1
        : smoothStep(clamp01(scrollY / HEADER_SCROLL_LOGO_DISTANCE))
      const borderAlpha = 0.72 * borderProgress
      const nextLogoState: 'expanded' | 'compact' = isMobileHeader
        ? 'compact'
        : logoProgress >= 0.5
          ? 'compact'
          : 'expanded'

      shell.style.borderColor = `rgba(34, 34, 34, ${borderAlpha.toFixed(3)})`
      shell.style.backgroundColor = `rgba(255, 255, 255, ${backgroundProgress.toFixed(3)})`
      logo.style.setProperty('--site-header-logo-progress', logoProgress.toFixed(3))
      setLogoState((current) => (current === nextLogoState ? current : nextLogoState))

      const fixedHeader = fixedHeaderRef.current
      if (fixedHeader) {
        const nextTop = Math.max(0, secondaryHeaderHeightRef.current - scrollY)
        fixedHeader.style.top = `${nextTop}px`
        document.documentElement.style.setProperty(
          '--site-header-fixed-bottom',
          isMobileHeader
            ? 'var(--site-header-height)'
            : `${fixedHeader.getBoundingClientRect().bottom}px`,
        )
      }
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
  }, [pathname])

  useLayoutEffect(() => {
    const secondaryHeader = secondaryHeaderRef.current

    if (!secondaryHeader) {
      secondaryHeaderHeightRef.current = 0
      document.documentElement.style.setProperty('--site-secondary-header-height', '0px')
      document.documentElement.style.setProperty('--site-header-fixed-bottom', '0px')
      applyScrollStateRef.current?.()
      return
    }

    const updateHeight = () => {
      const height = secondaryHeader.offsetHeight
      const isMobileHeader = window.matchMedia(MOBILE_HEADER_MEDIA_QUERY).matches
      secondaryHeaderHeightRef.current = height
      document.documentElement.style.setProperty('--site-secondary-header-height', `${height}px`)
      applyScrollStateRef.current?.()
      const fixedHeader = fixedHeaderRef.current
      if (fixedHeader) {
        document.documentElement.style.setProperty(
          '--site-header-fixed-bottom',
          isMobileHeader
            ? 'var(--site-header-height)'
            : `${fixedHeader.getBoundingClientRect().bottom}px`,
        )
      }
    }

    updateHeight()

    const resizeObserver = new ResizeObserver(updateHeight)
    resizeObserver.observe(secondaryHeader)

    return () => {
      resizeObserver.disconnect()
    }
  }, [hasSecondaryLinks])

  return (
    <>
      {hasSecondaryLinks ? (
        <div ref={secondaryHeaderRef} className="relative z-40">
          <SecondaryHeaderLinks header={header} />
        </div>
      ) : null}
      <header
        ref={fixedHeaderRef}
        className={cn(
          'container fixed inset-x-0 pt-(--site-header-top-offset)',
          menuOpen ? 'z-50' : 'z-70',
        )}
        style={{ top: 0 }}
        suppressHydrationWarning
      >
        <motion.div
          ref={shellRef}
          className={cn(headerShellClassName)}
          initial={shouldReduceMotion ? false : { opacity: 0, y: -10, filter: 'blur(2px)' }}
          transition={{ delay: 0.12, duration: 0.72, ease: 'easeOut' }}
          viewport={{ amount: 0.1, once: true }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }}
          style={shouldReduceMotion ? undefined : { willChange: 'transform, opacity, filter' }}
        >
          <motion.div
            ref={rowRef}
            data-header-state={logoState}
            className={cn(headerRowClassName)}
            initial={shouldReduceMotion ? false : { opacity: 0, y: -10, filter: 'blur(2px)' }}
            transition={{ delay: 0.36, duration: 0.62, ease: 'easeOut' }}
            viewport={{ amount: 0.1, once: true }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }}
            style={shouldReduceMotion ? undefined : { willChange: 'transform, opacity, filter' }}
          >
            <motion.div
              ref={logoRef}
              className={cn(headerLogoClassName)}
              initial={shouldReduceMotion ? false : { opacity: 0, y: -10, filter: 'blur(2px)' }}
              transition={{ delay: 0.62, duration: 0.55, ease: 'easeOut' }}
              viewport={{ amount: 0.1, once: true }}
              whileInView={
                shouldReduceMotion ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }
              }
              style={{
                ...headerLogoHeightStyle,
                ...(shouldReduceMotion ? undefined : { willChange: 'transform, opacity, filter' }),
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
                  state={logoState}
                />
              </Link>
            </motion.div>

            <div ref={navRef} className={cn(headerNavClassName)}>
              <HeaderNavLinks header={header} revealDelay={headerNavRevealDelay} />
            </div>

            <div ref={actionsRef}>
              <HeaderNavActions
                header={header}
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
