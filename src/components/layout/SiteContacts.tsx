import { Mail, MapPin, Phone, type LucideIcon } from 'lucide-react'
import React from 'react'

import type { SiteSetting } from '@/payload-types'

import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/ui'

type SiteContactProps = {
  siteSettings?: Pick<SiteSetting, 'phone' | 'email' | 'address'>
  className?: string
}

type SocialLinkProps = {
  siteSettings?: Pick<SiteSetting, 'vkUrl' | 'maxUrl' | 'telegramUrl' | 'whatsappUrl'>
  className?: string
  size?: React.ComponentProps<typeof Button>['size']
}

const socialItems = [
  { key: 'vk', label: 'VK' },
  { key: 'max', label: 'MAX' },
  { key: 'telegram', label: 'Telegram' },
  { key: 'whatsapp', label: 'WhatsApp' },
] as const

type ContactEntry =
  | {
      href: string
      icon: LucideIcon
      label: string
      value: string
    }
  | {
      icon: LucideIcon
      label: string
      value: string
    }

function normalizeTelHref(phone: string) {
  const normalized = phone.trim().replace(/[^\d+]/g, '')

  return normalized ? `tel:${normalized}` : ''
}

export function SiteSocialLinks({ siteSettings, className, size = 'sm' }: SocialLinkProps) {
  const socialLinks: Array<(typeof socialItems)[number] & { href: string }> = []

  if (siteSettings?.vkUrl) {
    socialLinks.push({ ...socialItems[0], href: siteSettings.vkUrl })
  }

  if (siteSettings?.maxUrl) {
    socialLinks.push({ ...socialItems[1], href: siteSettings.maxUrl })
  }

  if (siteSettings?.telegramUrl) {
    socialLinks.push({ ...socialItems[2], href: siteSettings.telegramUrl })
  }

  if (siteSettings?.whatsappUrl) {
    socialLinks.push({ ...socialItems[3], href: siteSettings.whatsappUrl })
  }

  if (socialLinks.length === 0) {
    return null
  }

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {socialLinks.map((item) => (
        <Button asChild key={item.key} size={size} variant="neutral">
          <a href={item.href} rel="noopener noreferrer" target="_blank">
            {item.label}
          </a>
        </Button>
      ))}
    </div>
  )
}

export function SiteContacts({ siteSettings, className }: SiteContactProps) {
  const contactEntries: ContactEntry[] = []

  if (siteSettings?.phone) {
    contactEntries.push({
      href: normalizeTelHref(siteSettings.phone),
      icon: Phone,
      label: 'Телефон',
      value: siteSettings.phone,
    })
  }

  if (siteSettings?.email) {
    contactEntries.push({
      href: `mailto:${siteSettings.email}`,
      icon: Mail,
      label: 'Email',
      value: siteSettings.email,
    })
  }

  if (siteSettings?.address) {
    contactEntries.push({
      icon: MapPin,
      label: 'Адрес',
      value: siteSettings.address,
    })
  }

  if (contactEntries.length === 0) {
    return null
  }

  return (
    <div className={cn('grid gap-3', className)}>
      {contactEntries.map((item) => {
        const Icon = item.icon

        return (
          <div
            className="rounded-base border-2 border-border bg-background px-4 py-3 shadow-shadow"
            key={`${item.label}-${item.value}`}
          >
            <div className="flex items-start gap-3">
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-base border-2 border-border bg-main text-main-foreground">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-foreground/60">{item.label}</p>
                {'href' in item ? (
                  <Button
                    asChild
                    className="mt-1 h-auto justify-start p-0 text-left text-sm leading-relaxed shadow-none hover:translate-x-0 hover:translate-y-0 hover:shadow-none"
                    size="sm"
                    variant="neutral"
                  >
                    <a href={item.href || '/'}>{item.value}</a>
                  </Button>
                ) : (
                  <p className="mt-1 text-sm leading-relaxed">{item.value}</p>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
