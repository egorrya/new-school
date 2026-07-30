'use client'

import Link from 'next/link'
import React from 'react'
import { motion, useReducedMotion } from 'motion/react'

import type { Header, SiteSetting } from '@/payload-types'

import { Button } from '@/components/ui/button'
import { MotionReveal } from '@/components/shared/MotionReveal'
import { SiteSocialLinks } from '@/components/layout/SiteContacts'
import { MobileMenu } from './MobileMenu.client'
import { getDocumentHref } from '@/utilities/getDocumentHref'
import { cn } from '@/utilities/ui'

type HeaderNavigationItem = NonNullable<Header['navigationLinks']>[number]
type HeaderSubNavigationItem = NonNullable<HeaderNavigationItem['subLinks']>[number]
type SecondaryHeaderItem = NonNullable<Header['secondaryHeaderLinks']>[number]

type NavigationLinksProps = {
  className?: string
  header: Header
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
  header: Header
  siteSettings?: SiteSetting
}

const navigationLinkClassName =
  'inline-flex text-sm font-medium leading-none text-foreground transition-[font-size] duration-200 ease-out hover:text-base'
export const headerNavigationItemDelayStep = 0.18
export const headerNavigationItemRevealDuration = 0.42
// Hamburger reveals slightly after the CTA button so the two don't pop in as one blob.
const headerActionsStagger = 0.1
const headerActionsRevealDuration = 0.22

export function resolveHref(
  link: HeaderNavigationItem['link'] | HeaderSubNavigationItem['link'] | SecondaryHeaderItem['link'],
) {
  if (link.type === 'reference') {
    if (!link.reference) {
      return ''
    }

    const reference = link.reference.value

    if (reference && typeof reference === 'object' && 'slug' in reference) {
      return getDocumentHref(link.reference.relationTo, reference.slug)
    }
  }

  return link.url?.trim() || ''
}

function NavigationLinks({
  className,
  header,
  itemClassName,
  revealDelay = 0,
}: NavigationLinksProps) {
  const navigationLinks = header.navigationLinks ?? []

  if (navigationLinks.length === 0) {
    return null
  }

  return (
    <nav
      aria-label="Основное меню"
      className={cn('pointer-events-auto flex flex-wrap items-center gap-8', className)}
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
          <MotionReveal
            allowMobileMotion
            className="inline-flex"
            delay={revealDelay + index * headerNavigationItemDelayStep}
            duration={headerNavigationItemRevealDuration}
            key={item.id || item.link.label}
            once
            y={8}
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
          </MotionReveal>
        )
      })}
    </nav>
  )
}

export function HeaderNavLinks({
  className,
  header,
  itemClassName,
  revealDelay,
}: NavigationLinksProps) {
  return (
    <NavigationLinks
      className={className}
      header={header}
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
  const applicationText = siteSettings?.defaultApplicationCtaText || 'Оставить заявку'
  const shouldReduceMotion = useReducedMotion() ?? false

  const revealInitial = shouldReduceMotion ? false : { opacity: 0, y: -10 }
  const revealWhileInView = shouldReduceMotion ? undefined : { opacity: 1, y: 0 }
  const revealStyle = shouldReduceMotion ? undefined : { willChange: 'transform, opacity' }
  const socialRevealDelay = Math.max(0, revealDelay - headerActionsStagger)

  return (
    <div className={cn('flex items-center justify-end gap-6', className)}>
      {hideSocialLinks ? null : (
        <motion.div
          className="hidden min-[900px]:flex"
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
          className="hidden min-[900px]:inline-flex"
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
          className="min-[900px]:hidden"
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
          <MobileMenu header={header} onOpenChange={onMenuOpenChange} open={menuOpen} siteSettings={siteSettings} />
        </motion.div>
      </div>
    </div>
  )
}

export function SecondaryHeaderLinks({ className, header, siteSettings }: SecondaryHeaderLinksProps) {
  const secondaryLinks = header.secondaryHeaderLinks ?? []

  return (
    <div className={cn('container', className)}>
      <div className="flex min-h-9 items-center justify-center gap-4 px-4 py-2 sm:justify-between sm:px-6">
        <SiteSocialLinks
          className="hidden shrink-0 sm:flex"
          linkClassName="text-white hover:text-white [--max-icon-background:white] [--max-icon-foreground:var(--school-black)]"
          siteSettings={siteSettings}
          variant="plain"
        />

        {secondaryLinks.length > 0 ? (
          <nav
            aria-label="Дополнительное меню"
            className="mx-auto flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-base font-medium leading-none sm:ml-auto sm:mr-0 sm:justify-end"
          >
            {secondaryLinks.map((item) => {
              const href = resolveHref(item.link)

              if (!href) {
                return null
              }

              const isExternal =
                href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')
              const linkClassName = 'text-white transition-colors hover:text-white'

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
