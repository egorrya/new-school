import { getCachedGlobal, getGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import { CMSLink } from '@/components/shared/Link'
import { Logo } from '@/components/shared/Logo/Logo'
import { SiteContacts, SiteSocialLinks } from '../SiteContacts'

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
    <footer className="mt-auto border-t-2 border-border bg-card text-foreground">
      <div className="container py-8 sm:py-10 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr_0.9fr]">
          <div className="space-y-5">
            <Link className="inline-flex" href="/" aria-label={siteName}>
              <Logo
                logo={siteSettings?.logoImage ?? null}
                logoType={siteSettings?.logoType ?? null}
                siteName={siteName}
              />
            </Link>
            <SiteContacts siteSettings={siteSettings} />
            <SiteSocialLinks siteSettings={siteSettings} />
          </div>

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
        </div>
      </div>
    </footer>
  )
}
