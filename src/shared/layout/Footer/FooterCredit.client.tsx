'use client'

import { AnimatePresence, motion, useReducedMotion, type Variants } from 'motion/react'
import { useState } from 'react'

import { FOOTER_MARK_LAST_LETTER_DELAY, FOOTER_MARK_LETTER_STAGGER } from './FooterMark.client'

const EASE_OUT = [0.22, 1, 0.36, 1] as const

const creditVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: FOOTER_MARK_LAST_LETTER_DELAY,
      staggerChildren: FOOTER_MARK_LETTER_STAGGER,
    },
  },
}

const wordVariants: Variants = {
  hidden: { opacity: 0, x: 6 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: EASE_OUT },
  },
}

const developerLabelVariants: Variants = {
  hidden: { opacity: 0, x: 4 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: EASE_OUT },
  },
}

type FooterCreditProps = {
  copyrightText: string
  inView: boolean
}

export function FooterCredit({ copyrightText, inView }: FooterCreditProps) {
  const shouldReduceMotion = useReducedMotion() ?? false
  const [isHovered, setIsHovered] = useState(false)
  const [hasBeenHovered, setHasBeenHovered] = useState(false)

  return (
    <p className="font-base flex items-baseline justify-center whitespace-nowrap text-[0.625rem] leading-none tracking-[0.01em] text-foreground/70 sm:text-[0.6875rem]">
      <motion.span
        className="inline-flex shrink-0 items-baseline"
        initial={shouldReduceMotion ? undefined : 'hidden'}
        animate={shouldReduceMotion ? undefined : inView ? 'visible' : 'hidden'}
        variants={shouldReduceMotion ? undefined : creditVariants}
      >
        <motion.span
          className="inline-flex shrink-0 items-baseline"
          variants={shouldReduceMotion ? undefined : wordVariants}
        >
          <span>{copyrightText}</span>
          <span className="mx-[0.7em] text-foreground/30" aria-hidden="true">
            |
          </span>
        </motion.span>
        <motion.a
          className="relative inline-grid shrink-0 items-baseline transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/60"
          href="https://soldsite.ru"
          target="_blank"
          rel="noreferrer"
          onMouseEnter={() => {
            setHasBeenHovered(true)
            setIsHovered(true)
          }}
          onMouseLeave={() => setIsHovered(false)}
          variants={shouldReduceMotion ? undefined : wordVariants}
        >
          <span className="invisible col-start-1 row-start-1 inline-flex items-baseline" aria-hidden="true">
            <span>Разработано</span>
            <span className="ml-[0.25em]">Soldsite</span>
          </span>
          <span
            className={`col-start-1 row-start-1 flex items-baseline ${isHovered ? 'justify-center' : 'justify-start'}`}
          >
            <AnimatePresence mode="popLayout">
              {!isHovered ? (
                <motion.span
                  className="origin-right"
                  initial={shouldReduceMotion || !hasBeenHovered ? false : 'hidden'}
                  animate="visible"
                  variants={shouldReduceMotion ? undefined : developerLabelVariants}
                  exit={
                    shouldReduceMotion
                      ? undefined
                      : {
                          opacity: 0,
                          scale: 0.94,
                          x: 6,
                          transition: { duration: 0.35, ease: EASE_OUT },
                        }
                  }
                >
                  Разработано
                </motion.span>
              ) : null}
            </AnimatePresence>
            <motion.span
              className={isHovered ? 'text-foreground/75' : 'ml-[0.25em] text-foreground/75'}
              layout
              transition={{ layout: { duration: 0.35, ease: EASE_OUT } }}
            >
              Soldsite
            </motion.span>
          </span>
        </motion.a>
      </motion.span>
    </p>
  )
}
