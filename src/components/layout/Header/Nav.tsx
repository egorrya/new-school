'use client'

import { Menu } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import type { Header, SiteSetting } from '@/payload-types'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { getDocumentHref } from '@/utilities/getDocumentHref'
import { cn } from '@/utilities/ui'

type HeaderNavigationItem = NonNullable<Header['navigationLinks']>[number]

type NavigationLinksProps = {
  className?: string
  header: Header
  itemClassName?: string
}

type HeaderNavActionsProps = {
  className?: string
  header: Header
  siteSettings?: SiteSetting
}

const navigationLinkClassName =
  'inline-flex origin-center text-sm font-medium leading-none text-foreground transition-transform duration-200 ease-out hover:scale-115'
const desktopCtaWrapperClassName = 'hidden lg:flex lg:items-center'
const desktopCtaButtonClassName = 'w-auto'

function resolveHref(link: HeaderNavigationItem['link']) {
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

function NavigationLinks({ className, header, itemClassName }: NavigationLinksProps) {
  const navigationLinks = header.navigationLinks ?? []

  if (navigationLinks.length === 0) {
    return null
  }

  return (
    <nav aria-label="Основное меню" className={cn('flex flex-wrap items-center gap-8', className)}>
      {navigationLinks.map((item) => {
        const href = resolveHref(item.link)
        const isExternal = href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')
        const linkClassName = cn(navigationLinkClassName, itemClassName)

        if (!href) {
          return null
        }

        if (isExternal) {
          return (
            <a
              className={linkClassName}
              href={href}
              key={item.id || item.link.label}
              rel={item.link.newTab ? 'noopener noreferrer' : undefined}
              target={item.link.newTab ? '_blank' : undefined}
            >
              {item.link.label}
            </a>
          )
        }

        return (
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
  )
}

export function HeaderNavLinks({ className, header, itemClassName }: NavigationLinksProps) {
  return <NavigationLinks className={className} header={header} itemClassName={itemClassName} />
}

export function HeaderNavActions({ className, header, siteSettings }: HeaderNavActionsProps) {
  const applicationText = siteSettings?.defaultApplicationCtaText || 'Оставить заявку'

  return (
    <div className={cn('flex items-center justify-end gap-2', className)}>
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button aria-label="Открыть меню" size="icon" variant="neutral">
              <Menu className="size-5" aria-hidden="true" />
            </Button>
          </SheetTrigger>
          <SheetContent className="gap-6 p-6">
            <SheetHeader className="p-0">
              <SheetTitle className="text-2xl">Меню</SheetTitle>
            </SheetHeader>

            <NavigationLinks
              className="flex-col items-start gap-4"
              header={header}
              itemClassName="text-lg"
            />

            <Button asChild className="w-full">
              <Link href="/clubs">
                {applicationText}
              </Link>
            </Button>
          </SheetContent>
        </Sheet>
      </div>

      <div className={desktopCtaWrapperClassName}>
        <Button asChild className={desktopCtaButtonClassName}>
          <Link href="/clubs">
            {applicationText}
          </Link>
        </Button>
      </div>
    </div>
  )
}
