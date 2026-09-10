'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import React, { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

import type { Header, SiteSetting } from '@/payload-types'

import { Button } from '@/shared/ui/primitives/button'
import { SiteSocialLinks } from '@/shared/layout/SiteContacts'
import { MobileMenuTrigger } from './MobileMenuTrigger.client'
import { resolveHref } from '@/shared/lib/resolveNavigationHref'
import { cn } from '@/shared/lib/cn'

const MobileMenu = dynamic(
  () => import('./MobileMenu.client').then((module) => module.MobileMenu),
  { ssr: false },
)

type NavigationLinksProps = {
  className?: string
  header: Header
  hideLastItemOnDesktop?: boolean
  itemClassName?: string
  revealDelay?: number
}

type HeaderNavActionsProps = {
  className?: string
  header: Header
  hideSocialLinks?: boolean
  siteSettings?: SiteSetting
  menuOpen: boolean
  onMenuOpenChange: (open: boolean) => void
  revealDelay?: number
}

type SecondaryHeaderLinksProps = {
  className?: string
  desktopCenterNavigationItem?: NonNullable<Header['navigationLinks']>[number]
  header: Header
  siteSettings?: SiteSetting
  socialLinksSpreadWidth?: string
}

const navigationLinkClassName =
  'inline-flex whitespace-nowrap text-base font-medium leading-none text-foreground transition-[font-size] duration-200 ease-out hover:text-lg'
export const headerNavigationItemDelayStep = 0.18
export const headerNavigationItemRevealDuration = 0.42
// Hamburger reveals slightly after the CTA button so the two don't pop in as one blob.
const headerActionsStagger = 0.1
const headerActionsRevealDuration = 0.22

function NavigationLinks({
  className,
  header,
  hideLastItemOnDesktop = false,
  itemClassName,
  revealDelay = 0,
}: NavigationLinksProps) {
  const navigationLinks = header.navigationLinks ?? []
  const shouldReduceMotion = useReducedMotion() ?? false

  if (navigationLinks.length === 0) {
    return null
  }

  return (
    <nav
      aria-label="Основное меню"
      className={cn(
        'pointer-events-auto flex w-max flex-nowrap items-center gap-8 xl:gap-12 2xl:gap-14',
        className,
      )}
    >
      {navigationLinks.map((item, index) => {
        const href = resolveHref(item.link)
        const isExternal =
          href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')
        const linkClassName = cn(navigationLinkClassName, itemClassName)
        const subLinks = item.subLinks ?? []

        if (!href) {
          return null
        }

        const link = isExternal ? (
          <a
            className={linkClassName}
            href={href}
            rel={item.link.newTab ? 'noopener noreferrer' : undefined}
            target={item.link.newTab ? '_blank' : undefined}
          >
            {item.link.label}
          </a>
        ) : (
          <Link
            className={linkClassName}
            href={href}
            rel={item.link.newTab ? 'noopener noreferrer' : undefined}
            target={item.link.newTab ? '_blank' : undefined}
          >
            {item.link.label}
          </Link>
        )

        return (
          <motion.div
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            className={cn(
              'inline-flex',
              hideLastItemOnDesktop && index === navigationLinks.length - 1 && 'xl:hidden',
            )}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
            key={item.id || item.link.label}
            transition={{
              delay: revealDelay + index * headerNavigationItemDelayStep,
              duration: headerNavigationItemRevealDuration,
              ease: 'easeOut',
            }}
          >
            <div className="group relative inline-flex items-center">
              {link}

              {subLinks.length > 0 ? (
                <div className="pointer-events-none invisible absolute left-1/2 top-full z-80 min-w-60 -translate-x-1/2 translate-y-1 pt-3 opacity-0 transition-all duration-200 ease-out group-hover:pointer-events-auto group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  <div className="rounded-base border border-border bg-white p-2">
                    {subLinks.map((subItem) => {
                      const subHref = resolveHref(subItem.link)

                      if (!subHref) {
                        return null
                      }

                      const isSubExternal =
                        subHref.startsWith('http') ||
                        subHref.startsWith('mailto:') ||
                        subHref.startsWith('tel:')
                      const subLinkClassName =
                        'block rounded-base px-3 py-2 text-sm leading-tight text-foreground transition-colors hover:bg-secondary-background hover:text-main focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground'

                      return isSubExternal ? (
                        <a
                          className={subLinkClassName}
                          href={subHref}
                          key={subItem.id || subItem.link.label}
                          rel={subItem.link.newTab ? 'noopener noreferrer' : undefined}
                          target={subItem.link.newTab ? '_blank' : undefined}
                        >
                          {subItem.link.label}
                        </a>
                      ) : (
                        <Link
                          className={subLinkClassName}
                          href={subHref}
                          key={subItem.id || subItem.link.label}
                          rel={subItem.link.newTab ? 'noopener noreferrer' : undefined}
                          target={subItem.link.newTab ? '_blank' : undefined}
                        >
                          {subItem.link.label}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          </motion.div>
        )
      })}
    </nav>
  )
}

export function HeaderNavLinks({
  className,
  header,
  hideLastItemOnDesktop,
  itemClassName,
  revealDelay,
}: NavigationLinksProps) {
  return (
    <NavigationLinks
      className={className}
      header={header}
      hideLastItemOnDesktop={hideLastItemOnDesktop}
      itemClassName={itemClassName}
      revealDelay={revealDelay}
    />
  )
}

export function HeaderNavActions({
  className,
  header,
  hideSocialLinks = false,
  siteSettings,
  menuOpen,
  onMenuOpenChange,
  revealDelay = 0,
}: HeaderNavActionsProps) {
  const applicationText = siteSettings?.defaultApplicationCtaText || 'Связаться'
  const shouldReduceMotion = useReducedMotion() ?? false
  const [hasOpenedMenu, setHasOpenedMenu] = useState(false)

  const revealInitial = shouldReduceMotion ? false : { opacity: 0, y: -10 }
  const revealWhileInView = shouldReduceMotion ? undefined : { opacity: 1, y: 0 }
  const revealStyle = shouldReduceMotion ? undefined : { willChange: 'transform, opacity' }
  const socialRevealDelay = Math.max(0, revealDelay - headerActionsStagger)
  const handleMenuOpenChange = (open: boolean) => {
    if (open) {
      setHasOpenedMenu(true)
    }

    onMenuOpenChange(open)
  }

  return (
    <div className={cn('flex items-center justify-end gap-6', className)}>
      {hideSocialLinks ? null : (
        <motion.div
          className="hidden xl:flex"
          initial={revealInitial}
          transition={{
            delay: socialRevealDelay,
            duration: headerActionsRevealDuration,
            ease: 'easeOut',
          }}
          viewport={{ amount: 0.1, once: true }}
          whileInView={revealWhileInView}
          style={revealStyle}
        >
          <SiteSocialLinks siteSettings={siteSettings} variant="plain" />
        </motion.div>
      )}
      <div className="flex items-center gap-2">
        <motion.div
          className="hidden xl:inline-flex"
          initial={revealInitial}
          transition={{
            delay: revealDelay,
            duration: headerActionsRevealDuration,
            ease: 'easeOut',
          }}
          viewport={{ amount: 0.1, once: true }}
          whileInView={revealWhileInView}
          style={revealStyle}
        >
          <Button asChild>
            <Link href="/contacts">{applicationText}</Link>
          </Button>
        </motion.div>
        <motion.div
          className="xl:hidden"
          initial={revealInitial}
          transition={{
            delay: revealDelay + headerActionsStagger * 2,
            duration: headerActionsRevealDuration,
            ease: 'easeOut',
          }}
          viewport={{ amount: 0.1, once: true }}
          whileInView={revealWhileInView}
          style={revealStyle}
        >
          <MobileMenuTrigger onOpenChange={handleMenuOpenChange} open={menuOpen} />
          {hasOpenedMenu ? (
            <MobileMenu
              header={header}
              hideTrigger
              onOpenChange={handleMenuOpenChange}
              open={menuOpen}
              siteSettings={siteSettings}
            />
          ) : null}
        </motion.div>
      </div>
    </div>
  )
}

export function SecondaryHeaderLinks({
  className,
  desktopCenterNavigationItem,
  header,
  siteSettings,
  socialLinksSpreadWidth,
}: SecondaryHeaderLinksProps) {
  const secondaryLinks = header.secondaryHeaderLinks ?? []
  const desktopCenterHref = desktopCenterNavigationItem
    ? resolveHref(desktopCenterNavigationItem.link)
    : ''
  const isDesktopCenterExternal =
    desktopCenterHref.startsWith('http') ||
    desktopCenterHref.startsWith('mailto:') ||
    desktopCenterHref.startsWith('tel:')
  const desktopCenterLinkClassName =
    'whitespace-nowrap text-xs font-medium leading-none text-foreground'

  return (
    <div className={className}>
      <div className="relative flex items-center justify-between gap-3 px-3 py-1.5 sm:gap-4 sm:px-2.5 sm:py-2 lg:gap-6 lg:px-4 lg:py-2.5">
        <SiteSocialLinks
          className="hidden shrink-0 sm:flex"
          linkClassName="size-[1.25rem]"
          siteSettings={siteSettings}
          spreadWidthWhenComplete={socialLinksSpreadWidth}
          variant="plain"
        />

        {desktopCenterHref ? (
          <nav
            aria-label="Сведения об образовательной организации"
            className="absolute left-1/2 hidden -translate-x-1/2 xl:flex"
          >
            {isDesktopCenterExternal ? (
              <a
                className={desktopCenterLinkClassName}
                href={desktopCenterHref}
                rel={desktopCenterNavigationItem?.link.newTab ? 'noopener noreferrer' : undefined}
                target={desktopCenterNavigationItem?.link.newTab ? '_blank' : undefined}
              >
                {desktopCenterNavigationItem?.link.label}
              </a>
            ) : (
              <Link
                className={desktopCenterLinkClassName}
                href={desktopCenterHref}
                rel={desktopCenterNavigationItem?.link.newTab ? 'noopener noreferrer' : undefined}
                target={desktopCenterNavigationItem?.link.newTab ? '_blank' : undefined}
              >
                {desktopCenterNavigationItem?.link.label}
              </Link>
            )}
          </nav>
        ) : null}

        {secondaryLinks.length > 0 ? (
          <nav
            aria-label="Дополнительное меню"
            className="mx-auto flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[17px] font-medium leading-none sm:absolute sm:right-2.5 sm:top-1/2 sm:mx-0 sm:-translate-y-1/2 sm:justify-end lg:right-4"
          >
            {secondaryLinks.map((item) => {
              const href = resolveHref(item.link)

              if (!href) {
                return null
              }

              const isExternal =
                href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')
              const linkClassName = 'text-foreground transition-colors hover:text-main'

              return isExternal ? (
                <a
                  className={linkClassName}
                  href={href}
                  key={item.id || item.link.label}
                  rel={item.link.newTab ? 'noopener noreferrer' : undefined}
                  target={item.link.newTab ? '_blank' : undefined}
                >
                  {item.link.label}
                </a>
              ) : (
                <Link
                  className={linkClassName}
                  href={href}
                  key={item.id || item.link.label}
                  rel={item.link.newTab ? 'noopener noreferrer' : undefined}
                  target={item.link.newTab ? '_blank' : undefined}
                >
                  {item.link.label}
                </Link>
              )
            })}
          </nav>
        ) : null}
      </div>
    </div>
  )
}
