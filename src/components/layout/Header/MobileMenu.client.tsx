'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'motion/react'
import { ArrowRight, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import type { Header, SiteSetting } from '@/payload-types'

import { Button } from '@/components/ui/button'
import { resolveHref } from './Nav'

type MobileMenuProps = {
  header: Header
  siteSettings?: SiteSetting
}

const EASE_OUT = [0.22, 1, 0.36, 1] as const

const overlayVariants: Variants = {
  hidden: { opacity: 0, backdropFilter: 'blur(0px)' },
  visible: { opacity: 1, backdropFilter: 'blur(6px)', transition: { duration: 0.3, ease: EASE_OUT } },
  exit: { opacity: 0, backdropFilter: 'blur(0px)', transition: { duration: 0.25, ease: EASE_OUT } },
}

const listVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
  exit: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
}

const bubbleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.4 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 340, damping: 22 },
  },
  exit: { opacity: 0, scale: 0.4, transition: { duration: 0.16, ease: EASE_OUT } },
}

const arrowHoverVariants: Variants = {
  rest: { opacity: 0, x: -10, rotate: -25 },
  hover: { opacity: 1, x: 0, rotate: 0, transition: { type: 'spring', stiffness: 420, damping: 22 } },
}

const PILL_ACCENTS = [
  { bg: 'var(--main)', fg: 'var(--main-foreground)' },
  { bg: 'var(--accent-sun)', fg: 'var(--foreground)' },
  { bg: 'var(--accent-green)', fg: 'var(--foreground)' },
  { bg: 'var(--accent-coral)', fg: 'var(--foreground)' },
  { bg: 'var(--accent-sky)', fg: 'var(--foreground)' },
]

export function MobileMenu({ header, siteSettings }: MobileMenuProps) {
  const [open, setOpen] = useState(false)
  const shouldReduceMotion = useReducedMotion() ?? false
  const navigationLinks = header.navigationLinks ?? []
  const applicationText = siteSettings?.defaultApplicationCtaText || 'Оставить заявку'

  const motionProps = shouldReduceMotion
    ? { initial: false as const }
    : { initial: 'hidden' as const, animate: 'visible' as const, exit: 'exit' as const }

  return (
    <Dialog.Root onOpenChange={setOpen} open={open}>
      <Dialog.Trigger asChild>
        <Button
          aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
          className="relative lg:hidden"
          size="icon"
          variant="neutral"
        >
          <span className="relative flex size-5 items-center justify-center">
            <AnimatePresence initial={false} mode="wait">
              {open ? (
                <motion.span
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                  exit={{ opacity: 0, rotate: -70, scale: 0.4 }}
                  initial={{ opacity: 0, rotate: 70, scale: 0.4 }}
                  key="close"
                  transition={{ duration: 0.22, ease: EASE_OUT }}
                >
                  <X aria-hidden="true" className="size-5" />
                </motion.span>
              ) : (
                <motion.span
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                  exit={{ opacity: 0, rotate: -70, scale: 0.4 }}
                  initial={{ opacity: 0, rotate: 70, scale: 0.4 }}
                  key="menu"
                  transition={{ duration: 0.22, ease: EASE_OUT }}
                >
                  <Menu aria-hidden="true" className="size-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </span>
        </Button>
      </Dialog.Trigger>

      <AnimatePresence>
        {open ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                {...motionProps}
                className="fixed inset-0 z-60 bg-overlay"
                variants={shouldReduceMotion ? undefined : overlayVariants}
              />
            </Dialog.Overlay>

            <Dialog.Content asChild forceMount>
              <div className="fixed inset-0 z-60 flex flex-col overflow-y-auto px-4 pt-24 pb-10 sm:px-6">
                <Dialog.Title className="sr-only">Меню</Dialog.Title>
                <Dialog.Close asChild>
                  <Button
                    aria-label="Закрыть меню"
                    className="fixed top-4 right-4 sm:top-6 sm:right-6"
                    size="icon"
                    variant="neutral"
                  >
                    <X aria-hidden="true" className="size-5" />
                  </Button>
                </Dialog.Close>

                <motion.ul
                  {...motionProps}
                  aria-label="Мобильное меню"
                  className="m-0 flex w-full max-w-md flex-1 list-none flex-col justify-center gap-3 self-center py-16"
                  role="menu"
                  variants={shouldReduceMotion ? undefined : listVariants}
                >
                  {navigationLinks.map((item, index) => {
                    const href = resolveHref(item.link)

                    if (!href) {
                      return null
                    }

                    const isExternal =
                      href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')

                    const linkProps = {
                      className: 'flex w-full items-center justify-between gap-3',
                      href,
                      onClick: () => setOpen(false),
                      rel: item.link.newTab ? 'noopener noreferrer' : undefined,
                      target: item.link.newTab ? '_blank' : undefined,
                    }

                    const accent = PILL_ACCENTS[index % PILL_ACCENTS.length]

                    const linkBody = (
                      <>
                        <span className="text-lg font-semibold">{item.link.label}</span>
                        <motion.span variants={arrowHoverVariants}>
                          <ArrowRight aria-hidden="true" className="size-5" />
                        </motion.span>
                      </>
                    )

                    return (
                      <motion.li key={item.id || item.link.label} role="none" variants={bubbleVariants}>
                        <motion.div
                          className="rounded-full border-2 border-border shadow-[0.25rem_0.25rem_0_0_#222] transition-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                          initial="rest"
                          style={{ background: accent.bg, color: accent.fg }}
                          whileHover="hover"
                          whileTap={{ scale: 0.97 }}
                        >
                          {isExternal ? (
                            <a {...linkProps} className={`${linkProps.className} rounded-full px-6 py-4`}>
                              {linkBody}
                            </a>
                          ) : (
                            <Link {...linkProps} className={`${linkProps.className} rounded-full px-6 py-4`}>
                              {linkBody}
                            </Link>
                          )}
                        </motion.div>
                      </motion.li>
                    )
                  })}

                  <motion.li className="mt-3" role="none" variants={bubbleVariants}>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}>
                      <Button asChild className="w-full shadow-none" onClick={() => setOpen(false)}>
                        <Link href="/clubs">{applicationText}</Link>
                      </Button>
                    </motion.div>
                  </motion.li>
                </motion.ul>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  )
}
