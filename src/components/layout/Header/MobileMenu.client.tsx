'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { AnimatePresence, LayoutGroup, motion, useReducedMotion, type Variants } from 'motion/react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState, type CSSProperties } from 'react'

import type { Header, SiteSetting } from '@/payload-types'

import { SiteSocialLinks } from '@/components/layout/SiteContacts'
import { Button } from '@/components/ui/button'
import { getItemTextColor, itemBackgroundColors } from '@/components/ui/marquee'
import { resolveHref } from './Nav'
import { cn } from '@/utilities/ui'

type MobileMenuProps = {
  header: Header
  siteSettings?: SiteSetting
  open: boolean
  onOpenChange: (open: boolean) => void
}

type NavigationItem = NonNullable<Header['navigationLinks']>[number]
type SubNavigationItem = NonNullable<NavigationItem['subLinks']>[number]
type PillLink = NavigationItem['link'] | SubNavigationItem['link']

const EASE_OUT = [0.22, 1, 0.36, 1] as const
const POP_EASE = [0.34, 1.56, 0.64, 1] as const

const DESKTOP_QUERY = '(min-width: 900px)'
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

const itemHoverTransition = { duration: 0.2, ease: EASE_OUT } as const
const itemTapTransition = { duration: 0.12, ease: EASE_OUT } as const

const PILL_ROTATIONS = [-2.5, 2.5, -2, 2, -2.5, 2.5, -2, 2]
const REQUIRED_NAVIGATION_HREF = '/organization-info'

const pillClassName =
  'flex w-full select-none items-center justify-center border-b border-border text-center text-foreground transition-colors duration-300 hover:text-main min-[900px]:rounded-full min-[900px]:border min-[900px]:bg-white min-[900px]:hover:bg-(--pill-hover-bg) min-[900px]:hover:text-(--pill-hover-text)'

const pillSizeClassName = cn(
  'min-h-16 px-4 py-4 text-xl font-medium',
  'min-[900px]:min-h-[160px] min-[900px]:px-4 min-[900px]:py-[clamp(1.5rem,3vw,8rem)] min-[900px]:text-[clamp(1.5rem,4vw,4rem)] min-[900px]:font-normal',
)

const requiredNavigationPillSizeClassName = cn(
  'min-h-16 px-4 py-4 text-base font-medium whitespace-nowrap',
  'min-[900px]:min-h-[130px] min-[900px]:max-w-[calc(100%-4rem)] min-[900px]:px-8 min-[900px]:py-[clamp(1rem,2vw,3rem)] min-[900px]:font-normal',
)

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

/** Mirrors the 3-column snake layout: centers a 1- or 2-item trailing row. */
function getSnakeOffsetClassName(index: number, total: number) {
  const remainder = total % 3
  const position = index + 1

  if (remainder === 1 && position === total) {
    return 'min-[900px]:ml-[calc(100%/3)]'
  }

  if (remainder === 2 && position === total - 1) {
    return 'min-[900px]:ml-[calc(100%/6)]'
  }

  return ''
}

function useIsDesktopMenu() {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY)
    const update = () => setIsDesktop(query.matches)

    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return isDesktop
}

function isRequiredNavigationLink(link: PillLink) {
  return resolveHref(link) === REQUIRED_NAVIGATION_HREF
}

export function MobileMenu({ header, siteSettings, open, onOpenChange }: MobileMenuProps) {
  const shouldReduceMotion = useReducedMotion() ?? false
  const isDesktop = useIsDesktopMenu()
  const navigationLinks = header.navigationLinks ?? []
  const applicationText = siteSettings?.defaultApplicationCtaText || 'Оставить заявку'
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
    index: number,
    total: number,
    onExpand?: () => void,
    isRequiredNavigation = false,
  ) => {
    const href = resolveHref(link)

    if (!onExpand && !href) {
      return null
    }

    const isExternal =
      href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')
    const rotation =
      isDesktop && !isRequiredNavigation ? PILL_ROTATIONS[index % PILL_ROTATIONS.length] : 0
    const hoverBg = itemBackgroundColors[index % itemBackgroundColors.length]

    const sharedClassName = cn(
      pillClassName,
      isRequiredNavigation ? requiredNavigationPillSizeClassName : pillSizeClassName,
    )
    const sharedStyle = {
      '--pill-hover-bg': hoverBg,
      '--pill-hover-text': getItemTextColor(hoverBg),
      fontSize: isRequiredNavigation
        ? 'clamp(0.72rem, calc((100vw - 3rem) / 28), 3.4rem)'
        : undefined,
    } as CSSProperties

    const linkBody = (
      <motion.span
        className={cn(
          'inline-flex items-center gap-2 leading-[1.2]',
          isRequiredNavigation && 'max-w-full whitespace-nowrap leading-none',
        )}
        variants={shouldReduceMotion ? undefined : labelVariants}
      >
        {link.label}
      </motion.span>
    )

    return (
      <motion.li
        className={cn(
          'flex flex-[0_0_100%] items-stretch justify-center box-border',
          isRequiredNavigation
            ? 'min-[900px]:flex-[0_0_100%] min-[900px]:px-2'
            : 'min-[900px]:flex-[0_0_calc(100%/3)] min-[900px]:px-2',
          !isRequiredNavigation && getSnakeOffsetClassName(index, total),
        )}
        custom={rotation}
        key={key}
        role="none"
        variants={shouldReduceMotion ? undefined : bubbleVariants}
        whileHover={
          shouldReduceMotion || !isDesktop
            ? undefined
            : { scale: 1.06, transition: itemHoverTransition }
        }
        whileTap={
          shouldReduceMotion || !isDesktop
            ? undefined
            : { scale: 0.94, transition: itemTapTransition }
        }
      >
        {onExpand ? (
          <button
            className={cn(sharedClassName, 'cursor-pointer')}
            onClick={onExpand}
            style={sharedStyle}
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
            style={sharedStyle}
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
            style={sharedStyle}
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
      <Dialog.Trigger asChild>
        <Button
          aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
          className={cn(
            'relative size-13 border-0 bg-transparent shadow-none hover:translate-x-0 hover:translate-y-0 hover:bg-transparent active:bg-transparent sm:border sm:border-border sm:shadow-[0.125rem_0.125rem_0_0_var(--school-black)] sm:hover:translate-x-[0.125rem] sm:hover:translate-y-[0.125rem] sm:hover:shadow-none min-[900px]:size-[3.25rem]',
            open && 'z-90',
          )}
          size="icon"
          variant="neutral"
        >
          <HamburgerIcon open={open} />
        </Button>
      </Dialog.Trigger>

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
              className="fixed inset-0 z-60 flex cursor-pointer flex-col items-center justify-center overflow-y-auto px-0 pt-24 pb-28 min-[900px]:px-6 min-[900px]:pb-10"
              onClick={handleBackdropClick}
            >
              <Dialog.Title className="sr-only">Меню</Dialog.Title>

              <LayoutGroup id="mobile-menu-layout">
                <div className="flex w-full max-w-[100rem] flex-col self-center">
                  <AnimatePresence mode="wait">
                    <motion.ul
                      layout={isDesktop}
                      {...motionProps}
                      aria-label={
                        isSubmenuOpen
                          ? `Подпункты: ${activeParent?.link.label ?? ''}`
                          : 'Мобильное меню'
                      }
                      className="m-0 flex w-full list-none flex-wrap py-8 min-[900px]:gap-y-2"
                      key={isSubmenuOpen ? `submenu-${activeParentIndex}` : 'root'}
                      role="menu"
                      variants={shouldReduceMotion ? undefined : listVariants}
                    >
                      {isSubmenuOpen
                        ? [
                            renderBackPill(),
                            ...activeSubLinks.map((subItem, index) =>
                              renderPill(
                                subItem.id || subItem.link.label,
                                subItem.link,
                                index,
                                activeSubLinks.length,
                              ),
                            ),
                          ]
                        : [
                            ...regularNavigationItems.map(({ item, originalIndex }, index) => {
                              const hasSubLinks = (item.subLinks?.length ?? 0) > 0

                              return renderPill(
                                item.id || item.link.label,
                                item.link,
                                index,
                                regularNavigationItems.length,
                                hasSubLinks ? () => setActiveParentIndex(originalIndex) : undefined,
                              )
                            }),
                            ...requiredNavigationItems.map(({ item, originalIndex }, index) => {
                              const hasSubLinks = (item.subLinks?.length ?? 0) > 0

                              return renderPill(
                                item.id || item.link.label,
                                item.link,
                                regularNavigationItems.length + index,
                                requiredNavigationItems.length,
                                hasSubLinks ? () => setActiveParentIndex(originalIndex) : undefined,
                                true,
                              )
                            }),
                          ]}

                      {!isSubmenuOpen ? (
                        <motion.li
                          className="flex flex-[0_0_100%] items-stretch justify-center box-border min-[900px]:hidden"
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
                className="fixed inset-x-0 bottom-0 z-10 flex cursor-default justify-center px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] min-[900px]:hidden"
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
