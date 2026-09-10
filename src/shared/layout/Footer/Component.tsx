import { getCachedGlobal } from '@/server/payload/getGlobals'
import Link from 'next/link'
import React from 'react'

import { CMSLink } from '@/shared/components/Link'
import { Logo } from '@/shared/components/Logo/Logo'
import { FooterReveal } from './FooterReveal.client'

export async function Footer() {
  const [footerData, headerData, siteSettings] = await Promise.all([
    getCachedGlobal('footer', 1)(),
    getCachedGlobal('header', 1)(),
    getCachedGlobal('site-settings', 1)(),
  ])

  const navigationLinks = headerData?.navigationLinks || []
  const footerNavigationLinks = navigationLinks.flatMap((item) =>
    item.subLinks?.length ? item.subLinks : [item],
  )
  const secondaryLinks = headerData?.secondaryHeaderLinks || []
  const siteName = siteSettings?.siteName || 'Новая школа'
  const copyrightText = footerData?.copyrightText || `© ${new Date().getFullYear()} ${siteName}`
  const legalEntityText = footerData?.legalEntityText

  return (
    <FooterReveal
      className="bg-card text-foreground"
      copyrightText={copyrightText}
      brand={
        <div>
          <Link className="inline-flex" href="/" aria-label={siteName}>
            <Logo
              logo={siteSettings?.logoImage ?? null}
              logoType={siteSettings?.logoType ?? null}
              siteName={siteName}
            />
          </Link>
        </div>
      }
      legal={
        <div className="space-y-4 font-base font-normal">
          {secondaryLinks.length > 0 ? (
            <nav className="grid gap-2">
              {secondaryLinks.map(({ link }, i) => {
                return (
                  <CMSLink
                    className="text-sm font-normal text-foreground/80 transition-colors hover:text-foreground"
                    key={i}
                    {...link}
                  />
                )
              })}
            </nav>
          ) : null}
          {legalEntityText ? (
            <p className="whitespace-pre-line text-xs font-normal leading-relaxed text-foreground/70">
              {legalEntityText}
            </p>
          ) : null}
        </div>
      }
      navigation={
        <div className="min-w-0 space-y-4">
          <nav className="grid min-w-0 gap-2">
            {footerNavigationLinks.map(({ link }, i) => {
              return (
                <CMSLink
                  className="min-w-0 wrap-break-word text-sm text-foreground/80 transition-colors hover:text-foreground"
                  key={i}
                  {...link}
                />
              )
            })}
          </nav>
        </div>
      }
    />
  )
}
