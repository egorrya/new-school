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
  siteSettings?: SiteSetting
  menuOpen: boolean
  onMenuOpenChange: (open: boolean) => void
  revealDelay?: number
}

type SecondaryHeaderLinksProps = {
  className?: string
  header: Header
}

const navigationLinkClassName =
  'inline-flex text-sm font-medium leading-none text-foreground transition-[font-size] duration-200 ease-out hover:text-base'
const navigationItemDelayStep = 0.18
// Hamburger reveals slightly after the CTA button so the two don't pop in as one blob.
const headerActionsStagger = 0.1
const headerActionsRevealDuration = 0.22

export function resolveHref(link: HeaderNavigationItem['link'] | SecondaryHeaderItem['link']) {
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
    <nav aria-label="Основное меню" className={cn('flex flex-wrap items-center gap-8', className)}>
      {navigationLinks.map((item, index) => {
        const href = resolveHref(item.link)
        const isExternal =
          href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')
        const linkClassName = cn(navigationLinkClassName, itemClassName)

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
            blur={3}
            className="inline-flex"
            delay={revealDelay + index * navigationItemDelayStep}
            duration={0.42}
            key={item.id || item.link.label}
            once
            y={8}
          >
            {link}
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
  siteSettings,
  menuOpen,
  onMenuOpenChange,
  revealDelay = 0,
}: HeaderNavActionsProps) {
  const applicationText = siteSettings?.defaultApplicationCtaText || 'Оставить заявку'
  const shouldReduceMotion = useReducedMotion() ?? false

  const revealInitial = shouldReduceMotion ? false : { opacity: 0, y: -10, filter: 'blur(2px)' }
  const revealWhileInView = shouldReduceMotion
    ? undefined
    : { opacity: 1, y: 0, filter: 'blur(0px)' }
  const revealStyle = shouldReduceMotion ? undefined : { willChange: 'transform, opacity, filter' }

  return (
    <div className={cn('flex items-center justify-end gap-6', className)}>
      <motion.div
        className="hidden min-[900px]:flex"
        initial={revealInitial}
        transition={{ delay: revealDelay, duration: headerActionsRevealDuration, ease: 'easeOut' }}
        viewport={{ amount: 0.1, once: true }}
        whileInView={revealWhileInView}
        style={revealStyle}
      >
        <SiteSocialLinks siteSettings={siteSettings} variant="plain" />
      </motion.div>
      <div className="flex items-center gap-2">
        <motion.div
          className="hidden min-[900px]:inline-flex"
          initial={revealInitial}
          transition={{
            delay: revealDelay + headerActionsStagger,
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

export function SecondaryHeaderLinks({ className, header }: SecondaryHeaderLinksProps) {
  const secondaryLinks = header.secondaryHeaderLinks ?? []

  if (secondaryLinks.length === 0) {
    return null
  }

  return (
    <div className={cn('container', className)}>
      <nav
        aria-label="Дополнительное меню"
        className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 px-4 py-2 text-xs sm:px-6"
      >
        {secondaryLinks.map((item) => {
          const href = resolveHref(item.link)

          if (!href) {
            return null
          }

          const isExternal =
            href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')
          const linkClassName =
            'text-foreground/70 transition-colors hover:text-foreground'

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
    </div>
  )
}
