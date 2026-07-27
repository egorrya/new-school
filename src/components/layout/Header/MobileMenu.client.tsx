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

const panelVariants: Variants = {
  hidden: { x: '100%', opacity: 0.6 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 320, damping: 34, mass: 0.9 },
  },
  exit: {
    x: '100%',
    opacity: 0.6,
    transition: { duration: 0.32, ease: EASE_OUT },
  },
}

const listVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.16 } },
  exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, x: 28, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 320, damping: 26 },
  },
  exit: { opacity: 0, x: 16, filter: 'blur(2px)', transition: { duration: 0.15 } },
}

const linkHoverVariants: Variants = {
  rest: { x: 0 },
  hover: { x: 6, transition: { type: 'spring', stiffness: 420, damping: 24 } },
}

const arrowHoverVariants: Variants = {
  rest: { opacity: 0, x: -10, rotate: -25 },
  hover: { opacity: 1, x: 0, rotate: 0, transition: { type: 'spring', stiffness: 420, damping: 22 } },
}

const pillHoverVariants: Variants = {
  rest: { opacity: 0, scale: 0.92 },
  hover: { opacity: 1, scale: 1, transition: { duration: 0.18, ease: EASE_OUT } },
}

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
                animate={{ opacity: 1, backdropFilter: 'blur(6px)' }}
                className="fixed inset-0 z-[60] bg-overlay"
                exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                transition={{ duration: 0.3, ease: EASE_OUT }}
              />
            </Dialog.Overlay>

            <Dialog.Content asChild forceMount>
              <motion.div
                {...motionProps}
                className="fixed inset-y-0 right-0 z-[60] flex h-full w-[85vw] max-w-sm flex-col gap-6 border-l-2 border-border bg-background px-6 pt-6 pb-10"
                variants={panelVariants}
              >
                <div className="flex items-center justify-end">
                  <Dialog.Title className="sr-only">Меню</Dialog.Title>
                  <Dialog.Close asChild>
                    <Button aria-label="Закрыть меню" size="icon" variant="neutral">
                      <X aria-hidden="true" className="size-5" />
                    </Button>
                  </Dialog.Close>
                </div>

                <motion.div
                  className="flex min-h-0 flex-1 flex-col gap-6"
                  variants={shouldReduceMotion ? undefined : listVariants}
                  {...motionProps}
                >
                  <nav aria-label="Мобильное меню" className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
                    {navigationLinks.map((item) => {
                      const href = resolveHref(item.link)

                      if (!href) {
                        return null
                      }

                      const isExternal =
                        href.startsWith('http') ||
                        href.startsWith('mailto:') ||
                        href.startsWith('tel:')

                      const linkProps = {
                        className: 'relative flex items-center justify-between gap-3 px-3 py-3',
                        href,
                        onClick: () => setOpen(false),
                        rel: item.link.newTab ? 'noopener noreferrer' : undefined,
                        target: item.link.newTab ? '_blank' : undefined,
                      }

                      const linkBody = (
                        <>
                          <motion.span
                            className="pointer-events-none absolute inset-y-0 inset-x-0 -z-10 rounded-base bg-secondary-background"
                            variants={pillHoverVariants}
                          />
                          <motion.span className="text-lg font-medium text-foreground" variants={linkHoverVariants}>
                            {item.link.label}
                          </motion.span>
                          <motion.span className="text-foreground/60" variants={arrowHoverVariants}>
                            <ArrowRight aria-hidden="true" className="size-5" />
                          </motion.span>
                        </>
                      )

                      return (
                        <motion.div key={item.id || item.link.label} variants={itemVariants}>
                          <motion.div initial="rest" whileHover="hover" whileTap={{ scale: 0.97 }}>
                            {isExternal ? (
                              <a {...linkProps}>{linkBody}</a>
                            ) : (
                              <Link {...linkProps}>{linkBody}</Link>
                            )}
                          </motion.div>
                        </motion.div>
                      )
                    })}
                  </nav>

                  <motion.div className="mt-auto" variants={itemVariants}>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}>
                      <Button asChild className="w-full shadow-none" onClick={() => setOpen(false)}>
                        <Link href="/clubs">{applicationText}</Link>
                      </Button>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  )
}
