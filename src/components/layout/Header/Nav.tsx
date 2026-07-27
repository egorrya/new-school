'use client'

import Link from 'next/link'
import React from 'react'

import type { Header, SiteSetting } from '@/payload-types'

import { Button } from '@/components/ui/button'
import { MotionReveal } from '@/components/shared/MotionReveal'
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
}

type SecondaryHeaderLinksProps = {
  className?: string
  header: Header
}

const navigationLinkClassName =
  'inline-flex text-sm font-medium leading-none text-foreground transition-[font-size] duration-200 ease-out hover:text-base'
const desktopCtaWrapperClassName = 'hidden lg:flex lg:items-center'
const desktopCtaButtonClassName = 'w-auto'
const navigationItemDelayStep = 0.18

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

export function HeaderNavActions({ className, header, siteSettings }: HeaderNavActionsProps) {
  const applicationText = siteSettings?.defaultApplicationCtaText || 'Оставить заявку'

  return (
    <div className={cn('flex items-center justify-end gap-2', className)}>
      <MobileMenu header={header} siteSettings={siteSettings} />

      <div className={desktopCtaWrapperClassName}>
        <Button asChild className={desktopCtaButtonClassName}>
          <Link href="/clubs">{applicationText}</Link>
        </Button>
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
