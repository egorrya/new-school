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
const HEADER_SCROLL_COMPACT_THRESHOLD = 48

const headerShellClassName =
  'relative overflow-visible rounded-base border-2 border-transparent bg-transparent shadow-none'
const headerRowClassName =
  'flex items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4 lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center lg:gap-6'
const headerLogoClassName =
  'inline-flex h-[var(--site-header-logo-height)] shrink-0 items-center transition-[height] duration-[560ms] ease-[cubic-bezier(0.22,1,0.36,1)] data-[header-state=expanded]:h-[var(--site-header-logo-height-expanded)] lg:justify-self-start'
const headerNavClassName = 'hidden lg:flex lg:justify-self-center'
const headerActionsClassName = 'lg:justify-self-end'
const headerNavRevealDelay = 0.88
const headerNavItemDelayStep = 0.18
const headerNavAfterItemsDelay = 0.3

export const HeaderClient: React.FC<HeaderClientProps> = ({ header, siteSettings }) => {
  const pathname = usePathname()
  const [logoState, setLogoState] = useState<'expanded' | 'compact'>('expanded')
  const shouldReduceMotion = useReducedMotion() ?? false
  const navigationLinkCount = header.navigationLinks?.length ?? 0
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

    const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1)
    const smoothStep = (value: number) => value * value * (3 - 2 * value)

    shell.style.transitionProperty = 'border-color, background-color'
    shell.style.transitionDuration = '180ms'
    shell.style.transitionTimingFunction = 'linear'

    const applyScrollState = () => {
      const scrollY = window.scrollY
      const borderProgress = smoothStep(clamp01(scrollY / HEADER_SCROLL_BORDER_DISTANCE))
      const backgroundProgress = smoothStep(clamp01(scrollY / HEADER_SCROLL_BACKGROUND_DISTANCE))
      const borderAlpha = 0.72 * borderProgress
      const nextLogoState: 'expanded' | 'compact' =
        scrollY >= HEADER_SCROLL_COMPACT_THRESHOLD ? 'compact' : 'expanded'

      shell.style.borderColor = `rgba(34, 34, 34, ${borderAlpha.toFixed(3)})`
      shell.style.backgroundColor = `rgba(255, 255, 255, ${backgroundProgress.toFixed(3)})`
      setLogoState((current) => (current === nextLogoState ? current : nextLogoState))

      const fixedHeader = fixedHeaderRef.current
      if (fixedHeader) {
        const nextTop = Math.max(0, secondaryHeaderHeightRef.current - scrollY)
        fixedHeader.style.top = `${nextTop}px`
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

    return () => {
      applyScrollStateRef.current = null
      window.removeEventListener('scroll', scheduleScrollState)
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
      applyScrollStateRef.current?.()
      return
    }

    const updateHeight = () => {
      const height = secondaryHeader.offsetHeight
      secondaryHeaderHeightRef.current = height
      document.documentElement.style.setProperty('--site-secondary-header-height', `${height}px`)
      applyScrollStateRef.current?.()
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
        className="container fixed inset-x-0 z-50 pt-(--site-header-top-offset)"
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
              data-header-state={logoState}
              className={cn(headerLogoClassName)}
              initial={shouldReduceMotion ? false : { opacity: 0, y: -10, filter: 'blur(2px)' }}
              transition={{ delay: 0.62, duration: 0.55, ease: 'easeOut' }}
              viewport={{ amount: 0.1, once: true }}
              whileInView={
                shouldReduceMotion ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }
              }
              style={shouldReduceMotion ? undefined : { willChange: 'transform, opacity, filter' }}
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

            <motion.div
              ref={actionsRef}
              className={cn(headerActionsClassName)}
              initial={shouldReduceMotion ? false : { opacity: 0, y: -10, filter: 'blur(2px)' }}
              transition={{
                delay:
                  headerNavRevealDelay +
                  navigationLinkCount * headerNavItemDelayStep +
                  headerNavAfterItemsDelay,
                duration: 0.3,
                ease: 'easeOut',
              }}
              viewport={{ amount: 0.1, once: true }}
              whileInView={
                shouldReduceMotion ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }
              }
              style={shouldReduceMotion ? undefined : { willChange: 'transform, opacity, filter' }}
            >
              <HeaderNavActions
                className="lg:justify-self-end"
                header={header}
                siteSettings={siteSettings}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </header>
    </>
  )
}
