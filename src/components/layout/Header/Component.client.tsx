'use client'

import gsap from 'gsap'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useLayoutEffect, useRef } from 'react'

import type { Header, SiteSetting } from '@/payload-types'

import { Logo } from '@/components/shared/Logo/Logo'
import { HeaderNavActions, HeaderNavLinks } from './Nav'
import { cn } from '@/utilities/ui'

interface HeaderClientProps {
  header: Header
  siteSettings?: SiteSetting
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ header, siteSettings }) => {
  const pathname = usePathname()
  const shellRef = useRef<HTMLDivElement | null>(null)
  const rowRef = useRef<HTMLDivElement | null>(null)
  const logoRef = useRef<HTMLDivElement | null>(null)
  const navRef = useRef<HTMLDivElement | null>(null)
  const actionsRef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    const shell = shellRef.current
    const row = rowRef.current
    const logo = logoRef.current
    const nav = navRef.current
    const actions = actionsRef.current

    if (!shell || !row || !logo || !nav || !actions) {
      return
    }

    const borderFadeDistance = 18
    const shadowStartDistance = 28
    const shadowFadeDistance = 16

    let scrollRaf = 0

    shell.style.transitionProperty = 'border-color, box-shadow'
    shell.style.transitionDuration = '180ms, 90ms'
    shell.style.transitionTimingFunction = 'linear, linear'

    const applyScrollState = () => {
      const scrollY = window.scrollY
      const borderProgress = Math.min(scrollY / borderFadeDistance, 1)
      const shadowProgress = Math.max(0, Math.min((scrollY - shadowStartDistance) / shadowFadeDistance, 1))

      shell.style.borderColor = `rgba(34, 34, 34, ${borderProgress.toFixed(3)})`
      shell.style.boxShadow = `0.2rem 0.2rem 0 0 rgba(34, 34, 34, ${shadowProgress.toFixed(3)})`
    }

    const scheduleScrollState = () => {
      if (scrollRaf !== 0) {
        return
      }

      scrollRaf = window.requestAnimationFrame(() => {
        scrollRaf = 0
        applyScrollState()
      })
    }

    const navLinks = nav.querySelectorAll('a')
    const actionItems = actions.querySelectorAll('a, button')
    const headerTimeline = gsap.timeline({
      defaults: {
        ease: 'power3.out',
      },
    })

    gsap.set([shell, row, logo, nav], {
      autoAlpha: 0,
      y: -10,
    })

    gsap.set(actions, {
      autoAlpha: 0,
    })

    gsap.set(navLinks, {
      autoAlpha: 0,
      y: -6,
    })

    gsap.set(actionItems, {
      autoAlpha: 0,
      y: -6,
    })

    headerTimeline
      .to(shell, {
        autoAlpha: 1,
        duration: 0.65,
        y: 0,
      })
      .to(
        row,
        {
          autoAlpha: 1,
          duration: 0.5,
          y: 0,
        },
        0.14,
      )
      .to(
        logo,
        {
          autoAlpha: 1,
          duration: 0.5,
          y: 0,
        },
        0.26,
      )
      .to(
        nav,
        {
          autoAlpha: 1,
          duration: 0.45,
          y: 0,
        },
        0.38,
      )
      .to(
        navLinks,
        {
          autoAlpha: 1,
          duration: 0.4,
          ease: 'power2.out',
          stagger: 0.12,
          y: 0,
        },
        0.46,
      )
      .to(
        actions,
        {
          autoAlpha: 1,
          duration: 0.28,
        },
        0.58,
      )
      .to(
        actionItems,
        {
          autoAlpha: 1,
          duration: 0.28,
          ease: 'none',
          stagger: 0.08,
          y: 0,
        },
        0.64,
      )

    applyScrollState()
    window.addEventListener('scroll', scheduleScrollState, { passive: true })

    return () => {
      window.removeEventListener('scroll', scheduleScrollState)
      if (scrollRaf !== 0) {
        window.cancelAnimationFrame(scrollRaf)
      }
      headerTimeline.kill()
      gsap.killTweensOf([shell, row, logo, nav, actions])
    }
  }, [pathname])

  return (
    <header className="container fixed inset-x-0 top-0 z-50 pt-1 sm:pt-2" suppressHydrationWarning>
      <div
        ref={shellRef}
        className={cn('relative overflow-hidden rounded-base border-2 border-transparent bg-card shadow-none')}
      >
        <div
          ref={rowRef}
          className={cn(
            'flex items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4 lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-6',
          )}
        >
          <div ref={logoRef} className="inline-flex shrink-0 lg:justify-self-start">
            <Link href="/" aria-label={siteSettings?.siteName || 'Новая школа'}>
              <Logo
                logo={siteSettings?.logoImage ?? null}
                logoType={siteSettings?.logoType ?? null}
                siteName={siteSettings?.siteName}
              />
            </Link>
          </div>

          <div ref={navRef} className="hidden lg:flex lg:justify-self-center">
            <HeaderNavLinks header={header} />
          </div>

          <div ref={actionsRef} className="lg:justify-self-end">
            <HeaderNavActions
              className="lg:justify-self-end"
              header={header}
              siteSettings={siteSettings}
            />
          </div>
        </div>
      </div>
    </header>
  )
}
