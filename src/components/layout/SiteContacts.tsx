'use client'

import { Clock, Mail, MapPin, Phone, type LucideIcon } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import React from 'react'

import type { SiteSetting } from '@/payload-types'

import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/ui'

type SiteContactProps = {
  siteSettings?: Pick<SiteSetting, 'phone' | 'email' | 'address' | 'workingHours'>
  className?: string
  variant?: 'card' | 'plain'
}

type SocialLinkProps = {
  siteSettings?: Pick<SiteSetting, 'vkUrl' | 'maxUrl' | 'telegramUrl' | 'whatsappUrl'>
  className?: string
  size?: React.ComponentProps<typeof Button>['size']
  variant?: 'button' | 'icon' | 'plain'
}

type IconComponent = LucideIcon | React.ComponentType<React.SVGProps<SVGSVGElement>>

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.4,
      delayChildren: 0.1,
    },
  },
}

const staggerItem = {
  hidden: { opacity: 0, y: 14, filter: 'blur(1.5px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
}

function VkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.407 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.862-.525-2.049-1.714-1.033-1.01-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202-2.17-3.023-2.763-5.292-2.763-5.744 0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.847 2.457 2.269 4.607 2.848 4.607.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.406.44-.406h2.744c.372 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.15-3.574 2.15-3.574.119-.254.32-.491.762-.491h1.744c.525 0 .643.271.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.775 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.49-.085.744-.576.744z" />
    </svg>
  )
}

function TelegramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  )
}

function MaxIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 1000 1000" fill="currentColor" {...props}>
      <defs>
        <linearGradient id="maxGradB">
          <stop offset="0" stopColor="currentColor" />
          <stop offset="1" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="maxGradA">
          <stop offset="0" stopColor="currentColor" />
          <stop offset=".662" stopColor="currentColor" />
          <stop offset="1" stopColor="currentColor" />
        </linearGradient>
      </defs>
      <rect width="1000" height="1000" fill="url(#maxGradA)" ry="249.681" />
      <path fill="white" fillRule="evenodd" d="M508.211 878.328c-75.007 0-109.864-10.95-170.453-54.75-38.325 49.275-159.686 87.783-164.979 21.9 0-49.456-10.95-91.248-23.36-136.873-14.782-56.21-31.572-118.807-31.572-209.508 0-216.626 177.754-379.597 388.357-379.597 210.785 0 375.947 171.001 375.947 381.604.707 207.346-166.595 376.118-373.94 377.224m3.103-571.585c-102.564-5.292-182.499 65.7-200.201 177.024-14.6 92.162 11.315 204.398 33.397 210.238 10.585 2.555 37.23-18.98 53.837-35.587a189.8 189.8 0 0 0 92.71 33.032c106.273 5.112 197.08-75.794 204.215-181.95 4.154-106.382-77.67-196.486-183.958-202.574Z" clipRule="evenodd" />
    </svg>
  )
}

function WhatsappIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.868-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  )
}

const socialItems: Array<{ key: string; label: string; icon: IconComponent }> = [
  { key: 'vk', label: 'VK', icon: VkIcon },
  { key: 'max', label: 'MAX', icon: MaxIcon },
  { key: 'telegram', label: 'Telegram', icon: TelegramIcon },
  { key: 'whatsapp', label: 'WhatsApp', icon: WhatsappIcon },
]

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

export function SiteSocialLinks({
  siteSettings,
  className,
  size = 'sm',
  variant = 'button',
}: SocialLinkProps) {
  const shouldReduceMotion = useReducedMotion() ?? false
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

  if (variant === 'plain') {
    return (
      <div className={cn('flex items-center gap-4', className)}>
        {socialLinks.map((item) => {
          const Icon = item.icon

          return (
            <a
              aria-label={item.label}
              className="inline-flex size-5 items-center justify-center text-foreground transition-all duration-200 ease-out hover:-translate-y-0.5 hover:scale-110 hover:text-main motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100"
              href={item.href}
              key={item.key}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Icon aria-hidden="true" className="size-full" />
            </a>
          )
        })}
      </div>
    )
  }

  if (variant === 'icon') {
    return (
      <motion.div
        className={cn('flex flex-wrap gap-3', className)}
        initial={shouldReduceMotion ? undefined : 'hidden'}
        variants={shouldReduceMotion ? undefined : staggerContainer}
        viewport={{ amount: 0.4, margin: '0px 0px -10% 0px', once: false }}
        whileInView={shouldReduceMotion ? undefined : 'visible'}
      >
        {socialLinks.map((item) => {
          const Icon = item.icon

          return (
            <motion.a
              aria-label={item.label}
              className="inline-flex size-12 items-center justify-center rounded-base border-2 border-border bg-main text-main-foreground shadow-[0.25rem_0.25rem_0_0_#222] transition-all hover:translate-x-[0.25rem] hover:translate-y-[0.25rem] hover:shadow-none"
              href={item.href}
              key={item.key}
              rel="noopener noreferrer"
              target="_blank"
              variants={shouldReduceMotion ? undefined : staggerItem}
            >
              <Icon aria-hidden="true" className="size-6" />
            </motion.a>
          )
        })}
      </motion.div>
    )
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

export function SiteContacts({ siteSettings, className, variant = 'card' }: SiteContactProps) {
  const shouldReduceMotion = useReducedMotion() ?? false
  const contactEntries: ContactEntry[] = []

  if (siteSettings?.phone) {
    contactEntries.push({
      href: normalizeTelHref(siteSettings.phone),
      icon: Phone,
      label: 'Телефон',
      value: siteSettings.phone,
    })
  }

  if (siteSettings?.address) {
    contactEntries.push({
      icon: MapPin,
      label: 'Адрес',
      value: siteSettings.address,
    })
  }

  if (siteSettings?.workingHours) {
    contactEntries.push({
      icon: Clock,
      label: 'Время работы',
      value: siteSettings.workingHours,
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

  if (contactEntries.length === 0) {
    return null
  }

  if (variant === 'plain') {
    return (
      <motion.div
        className={cn('flex flex-col gap-4', className)}
        initial={shouldReduceMotion ? undefined : 'hidden'}
        variants={shouldReduceMotion ? undefined : staggerContainer}
        viewport={{ amount: 0.4, margin: '0px 0px -10% 0px', once: false }}
        whileInView={shouldReduceMotion ? undefined : 'visible'}
      >
        {contactEntries.map((item) => {
          const Icon = item.icon

          return (
            <motion.div
              className="flex items-center gap-4"
              key={`${item.label}-${item.value}`}
              variants={shouldReduceMotion ? undefined : staggerItem}
            >
              <Icon className="size-6 shrink-0 text-foreground" aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-xs text-foreground/60">{item.label}</p>
                {'href' in item ? (
                  <a
                    className="mt-1 block text-base font-medium leading-relaxed transition-colors hover:text-main hover:underline underline-offset-2 sm:text-lg"
                    href={item.href || '/'}
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="mt-1 text-base font-medium leading-relaxed sm:text-lg">{item.value}</p>
                )}
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    )
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
