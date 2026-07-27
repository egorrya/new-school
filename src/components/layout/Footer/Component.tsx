import { getCachedGlobal, getGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import { CMSLink } from '@/components/shared/Link'
import { Logo } from '@/components/shared/Logo/Logo'
import { FooterReveal } from './FooterReveal.client'

export async function Footer() {
  const [footerData, siteSettings] = await Promise.all([
    getCachedGlobal('footer', 1)(),
    getGlobal('site-settings', 1),
  ])

  const footerNavigation = footerData?.footerNavigation || []
  const legalLinks = footerData?.legalLinks || []
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
        </div>
      }
      legal={
        <div className="space-y-4">
          <p className="text-sm text-foreground/60">Правовая информация</p>
          <nav className="grid gap-2">
            {legalLinks.map(({ link }, i) => {
              return (
                <CMSLink
                  className="text-sm text-foreground/80 transition-colors hover:text-foreground"
                  key={i}
                  {...link}
                />
              )
            })}
          </nav>
          <p className="pt-2 text-xs leading-relaxed text-foreground/60">{copyrightText}</p>
        </div>
      }
      navigation={
        <div className="space-y-4">
          <p className="text-sm text-foreground/60">Навигация</p>
          <nav className="grid gap-2">
            {footerNavigation.map(({ link }, i) => {
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
