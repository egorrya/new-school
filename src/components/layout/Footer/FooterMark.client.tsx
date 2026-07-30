'use client'

import { motion, useReducedMotion, type Variants } from 'motion/react'

const BRAND_MARK = 'НОВАЯ ШКОЛА'
const EASE_OUT = [0.22, 1, 0.36, 1] as const

const rowVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
}

const letterVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, ease: EASE_OUT },
  },
}

type FooterMarkProps = {
  inView: boolean
}

/**
 * Oversized brand wordmark that closes out the footer. It sits flush with
 * the footer's (viewport-pinned) bottom edge and is nudged down by 30% of
 * its own height so the glyphs run off past the screen edge; the white
 * overlay fades the same 30% band back to the footer background so the
 * cutoff never reads as a hard clip.
 *
 * The footer itself is `position: fixed`, so it never actually leaves the
 * viewport and a `whileInView` on this element alone would fire on first
 * paint. `inView` is derived by the caller from the in-flow scroll
 * placeholder instead, so the reveal actually tracks the curtain scrolling
 * away.
 */
export function FooterMark({ inView }: FooterMarkProps) {
  const shouldReduceMotion = useReducedMotion() ?? false
  const letters = Array.from(BRAND_MARK)

  return (
    <div
      className="pointer-events-none relative w-full select-none overflow-hidden [-webkit-touch-callout:none] [-webkit-user-select:none] [user-select:none]"
      aria-hidden="true"
    >
      <motion.div
        className="font-heading font-[800] pointer-events-none flex w-full translate-y-[30%] cursor-default select-none justify-center whitespace-nowrap leading-none text-black [-webkit-user-select:none] [user-select:none]"
        style={{ fontSize: 'clamp(2.15rem, 11.9vw, 15.3rem)' }}
        initial={shouldReduceMotion ? undefined : 'hidden'}
        animate={shouldReduceMotion ? undefined : inView ? 'visible' : 'hidden'}
        variants={shouldReduceMotion ? undefined : rowVariants}
      >
        {letters.map((letter, index) => (
          <motion.span
            key={`${letter}-${index}`}
            variants={shouldReduceMotion ? undefined : letterVariants}
          >
            {letter === ' ' ? ' ' : letter}
          </motion.span>
        ))}
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,transparent_68%,white_94%,white_100%)]" />
    </div>
  )
}
