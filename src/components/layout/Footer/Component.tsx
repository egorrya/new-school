import { getCachedGlobal, getGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import { CMSLink } from '@/components/shared/Link'
import { Logo } from '@/components/shared/Logo/Logo'
import { FooterReveal } from './FooterReveal.client'

export async function Footer() {
  const [footerData, headerData, siteSettings] = await Promise.all([
    getCachedGlobal('footer', 1)(),
    getCachedGlobal('header', 1)(),
    getGlobal('site-settings', 1),
  ])

  const navigationLinks = headerData?.navigationLinks || []
  const secondaryLinks = headerData?.secondaryHeaderLinks || []
  const siteName = siteSettings?.siteName || 'Новая школа'
  const copyrightText =
    footerData?.copyrightText || `© ${new Date().getFullYear()} ${siteName}`

  return (
    <FooterReveal
      className="bg-card text-foreground"
      brand={
        <div className="space-y-5">
          <Link className="inline-flex" href="/" aria-label={siteName}>
            <Logo
              logo={siteSettings?.logoImage ?? null}
              logoType={siteSettings?.logoType ?? null}
              siteName={siteName}
            />
          </Link>
          <p className="text-xs leading-relaxed text-foreground/60">{copyrightText}</p>
        </div>
      }
      legal={
        <div className="space-y-4">
          <p className="text-sm text-foreground/60">Ещё</p>
          <nav className="grid gap-2">
            {secondaryLinks.map(({ link }, i) => {
              return (
                <CMSLink
                  className="text-sm text-foreground/80 transition-colors hover:text-foreground"
                  key={i}
                  {...link}
                />
              )
            })}
          </nav>
        </div>
      }
      navigation={
        <div className="space-y-4">
          <p className="text-sm text-foreground/60">Навигация</p>
          <nav className="grid gap-2">
            {navigationLinks.map(({ link }, i) => {
              return (
                <CMSLink
                  className="text-sm text-foreground/80 transition-colors hover:text-foreground"
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
