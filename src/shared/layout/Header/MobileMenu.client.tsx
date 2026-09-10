'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { AnimatePresence, LayoutGroup, motion, useReducedMotion, type Variants } from 'motion/react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import type { Header, SiteSetting } from '@/payload-types'

import { SiteSocialLinks } from '@/shared/layout/SiteContacts'
import { Button } from '@/shared/ui/primitives/button'
import { resolveHref } from '@/shared/lib/resolveNavigationHref'
import { cn } from '@/shared/lib/cn'

type MobileMenuProps = {
  header: Header
  hideTrigger?: boolean
  siteSettings?: SiteSetting
  open: boolean
  onOpenChange: (open: boolean) => void
}

type NavigationItem = NonNullable<Header['navigationLinks']>[number]
type SubNavigationItem = NonNullable<NavigationItem['subLinks']>[number]
type PillLink = NavigationItem['link'] | SubNavigationItem['link']

const EASE_OUT = [0.22, 1, 0.36, 1] as const
const POP_EASE = [0.34, 1.56, 0.64, 1] as const

const MENU_CLOSE_ANIMATION_MS = 420

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35, ease: EASE_OUT } },
  exit: { opacity: 0, transition: { duration: 0.4, ease: EASE_OUT } },
}

const listVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  exit: { transition: { staggerChildren: 0.025, staggerDirection: -1 } },
}

const bubbleVariants: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: (rotate: number = 0) => ({
    opacity: 1,
    scale: 1,
    rotate,
    transition: { duration: 0.5, ease: POP_EASE },
  }),
  exit: { opacity: 0, scale: 0.85, transition: { duration: 0.22, ease: EASE_OUT } },
}

const labelVariants: Variants = {
  hidden: { y: 24, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.45, ease: EASE_OUT, delay: 0.06 } },
  exit: { y: 12, opacity: 0, transition: { duration: 0.2, ease: EASE_OUT } },
}

const REQUIRED_NAVIGATION_HREF = '/organization-info'

const pillClassName =
  'flex w-full select-none items-center justify-center border-b border-border text-center text-foreground transition-colors duration-300 hover:text-main'

const pillSizeClassName = 'min-h-16 px-4 py-4 text-xl font-medium'

const hamburgerBarClassName = 'absolute left-0 h-0.5 w-5 rounded-full bg-current'

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <span className="relative flex size-5 items-center justify-center">
      <motion.span
        animate={{ y: open ? 4 : 0, rotate: open ? 45 : 0 }}
        className={cn(hamburgerBarClassName, 'top-[5px]')}
        transition={{ duration: 0.28, ease: EASE_OUT }}
      />
      <motion.span
        animate={{ opacity: open ? 0 : 1 }}
        className={cn(hamburgerBarClassName, 'top-[9px]')}
        transition={{ duration: 0.16, ease: EASE_OUT }}
      />
      <motion.span
        animate={{ y: open ? -4 : 0, rotate: open ? -45 : 0 }}
        className={cn(hamburgerBarClassName, 'top-[13px]')}
        transition={{ duration: 0.28, ease: EASE_OUT }}
      />
    </span>
  )
}

function isRequiredNavigationLink(link: PillLink) {
  return resolveHref(link) === REQUIRED_NAVIGATION_HREF
}

export function MobileMenu({ header, hideTrigger = false, siteSettings, open, onOpenChange }: MobileMenuProps) {
  const shouldReduceMotion = useReducedMotion() ?? false
  const navigationLinks = header.navigationLinks ?? []
  const applicationText = siteSettings?.defaultApplicationCtaText || 'Связаться'
  const [isMounted, setIsMounted] = useState(open)
  const [activeParentIndex, setActiveParentIndex] = useState<number | null>(null)

  const activeParent = activeParentIndex !== null ? navigationLinks[activeParentIndex] : undefined
  const activeSubLinks = activeParent?.subLinks ?? []
  const isSubmenuOpen = activeParentIndex !== null
  const menuMotionState = open ? ('visible' as const) : ('exit' as const)
  const rootNavigationItems = navigationLinks.map((item, index) => ({ item, originalIndex: index }))
  const requiredNavigationItems = rootNavigationItems.filter(({ item }) =>
    isRequiredNavigationLink(item.link),
  )
  const regularNavigationItems = rootNavigationItems.filter(
    ({ item }) => !isRequiredNavigationLink(item.link),
  )

  const motionProps = shouldReduceMotion
    ? { initial: false as const, animate: menuMotionState }
    : { initial: 'hidden' as const, animate: menuMotionState }

  // Reset back to the root list whenever the dialog closes, so it always reopens at the top level.
  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setIsMounted(true)
      setActiveParentIndex(null)
    }

    onOpenChange(nextOpen)
  }

  useEffect(() => {
    if (open) {
      return
    }

    const closeTimer = window.setTimeout(() => {
      setIsMounted(false)
      setActiveParentIndex(null)
    }, MENU_CLOSE_ANIMATION_MS)

    return () => window.clearTimeout(closeTimer)
  }, [open])

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement
    if (!target.closest('a, button')) {
      handleOpenChange(false)
    }
  }

  const closeMenu = () => handleOpenChange(false)

  const renderBackPill = () => (
    <motion.li
      className="flex flex-[0_0_100%] items-stretch justify-center box-border"
      custom={0}
      key="back"
      role="none"
      variants={shouldReduceMotion ? undefined : bubbleVariants}
    >
      <button
        aria-label="Назад к меню"
        className={cn(
          pillClassName,
          'min-h-16 px-4 py-4 text-sm font-medium',
          'cursor-pointer gap-2',
        )}
        onClick={() => setActiveParentIndex(null)}
        type="button"
      >
        <motion.span
          className="inline-flex items-center gap-2 leading-[1.2]"
          variants={shouldReduceMotion ? undefined : labelVariants}
        >
          <ArrowLeft aria-hidden="true" className="size-5" />
          Назад
        </motion.span>
      </button>
    </motion.li>
  )

  const renderPill = (
    key: string,
    link: PillLink,
    onExpand?: () => void,
  ) => {
    const href = resolveHref(link)

    if (!onExpand && !href) {
      return null
    }

    const isExternal =
      href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')

    const sharedClassName = cn(pillClassName, pillSizeClassName)

    const linkBody = (
      <motion.span
        className="inline-flex items-center gap-2 leading-[1.2]"
        variants={shouldReduceMotion ? undefined : labelVariants}
      >
        {link.label}
      </motion.span>
    )

    return (
      <motion.li
        className="flex flex-[0_0_100%] items-stretch justify-center box-border"
        key={key}
        role="none"
        variants={shouldReduceMotion ? undefined : bubbleVariants}
      >
        {onExpand ? (
          <button
            className={cn(sharedClassName, 'cursor-pointer')}
            onClick={onExpand}
            type="button"
          >
            {linkBody}
          </button>
        ) : isExternal ? (
          <a
            className={sharedClassName}
            href={href}
            onClick={closeMenu}
            rel={link.newTab ? 'noopener noreferrer' : undefined}
            target={link.newTab ? '_blank' : undefined}
          >
            {linkBody}
          </a>
        ) : (
          <Link
            className={sharedClassName}
            href={href}
            onClick={closeMenu}
            rel={link.newTab ? 'noopener noreferrer' : undefined}
            target={link.newTab ? '_blank' : undefined}
          >
            {linkBody}
          </Link>
        )}
      </motion.li>
    )
  }

  return (
    <Dialog.Root onOpenChange={handleOpenChange} open={open}>
      {!hideTrigger ? (
        <Dialog.Trigger asChild>
          <Button
            aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
            className={cn(
              'relative size-13 border-0 bg-transparent shadow-none hover:translate-x-0 hover:translate-y-0 hover:bg-transparent hover:shadow-none active:bg-transparent sm:shadow-none sm:hover:shadow-none',
              open && 'z-90',
            )}
            size="icon"
            variant="neutral"
          >
            <HamburgerIcon open={open} />
          </Button>
        </Dialog.Trigger>
      ) : null}

      {isMounted ? (
        <Dialog.Portal forceMount>
          <Dialog.Overlay asChild forceMount>
            <motion.div
              {...motionProps}
              className="fixed inset-0 z-60 bg-white/96 will-change-[opacity] sm:bg-white/92"
              variants={shouldReduceMotion ? undefined : overlayVariants}
            />
          </Dialog.Overlay>

          <Dialog.Content asChild forceMount>
            <div
              className="fixed inset-0 z-60 flex cursor-pointer flex-col items-center justify-center overflow-y-auto px-0 pt-24 pb-28"
              onClick={handleBackdropClick}
            >
              <Dialog.Title className="sr-only">Меню</Dialog.Title>

              <LayoutGroup id="mobile-menu-layout">
                <div className="flex w-full max-w-[100rem] flex-col self-center">
                  <AnimatePresence mode="wait">
                    <motion.ul
                      {...motionProps}
                      aria-label={
                        isSubmenuOpen
                          ? `Подпункты: ${activeParent?.link.label ?? ''}`
                          : 'Мобильное меню'
                      }
                      className="m-0 flex w-full list-none flex-wrap py-8"
                      key={isSubmenuOpen ? `submenu-${activeParentIndex}` : 'root'}
                      role="menu"
                      variants={shouldReduceMotion ? undefined : listVariants}
                    >
                      {isSubmenuOpen
                        ? [
                            renderBackPill(),
                            ...activeSubLinks.map((subItem) =>
                              renderPill(subItem.id || subItem.link.label, subItem.link),
                            ),
                          ]
                        : [
                            ...regularNavigationItems.map(({ item, originalIndex }) => {
                              const hasSubLinks = (item.subLinks?.length ?? 0) > 0

                              return renderPill(
                                item.id || item.link.label,
                                item.link,
                                hasSubLinks ? () => setActiveParentIndex(originalIndex) : undefined,
                              )
                            }),
                            ...requiredNavigationItems.map(({ item, originalIndex }) => {
                              const hasSubLinks = (item.subLinks?.length ?? 0) > 0

                              return renderPill(
                                item.id || item.link.label,
                                item.link,
                                hasSubLinks ? () => setActiveParentIndex(originalIndex) : undefined,
                              )
                            }),
                          ]}

                      {!isSubmenuOpen ? (
                        <motion.li
                          className="flex flex-[0_0_100%] items-stretch justify-center box-border"
                          custom={0}
                          role="none"
                          variants={shouldReduceMotion ? undefined : bubbleVariants}
                        >
                          <Link
                            className={cn(pillClassName, pillSizeClassName, 'gap-2')}
                            href="/contacts"
                            onClick={closeMenu}
                          >
                            <motion.span
                              className="inline-flex items-center gap-2 leading-[1.2]"
                              variants={shouldReduceMotion ? undefined : labelVariants}
                            >
                              {applicationText}
                              <ArrowRight aria-hidden="true" className="size-5" />
                            </motion.span>
                          </Link>
                        </motion.li>
                      ) : null}
                    </motion.ul>
                  </AnimatePresence>
                </div>
              </LayoutGroup>

              <div
                className="fixed inset-x-0 bottom-0 z-10 flex cursor-default justify-center px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
                onClick={(event) => event.stopPropagation()}
              >
                <SiteSocialLinks
                  animatePlainMobile
                  className="pointer-events-auto justify-center gap-6 px-5 py-3"
                  motionState={menuMotionState}
                  siteSettings={siteSettings}
                  variant="plain"
                />
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      ) : null}
    </Dialog.Root>
  )
}
