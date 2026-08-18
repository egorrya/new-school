'use client'

import { motion, useReducedMotion } from 'motion/react'

type SchoolLifeMarkProps = {
  delay?: number
  isVisible?: boolean
}

export function SchoolLifeMark({ delay = 0, isVisible = true }: SchoolLifeMarkProps) {
  const shouldReduceMotion = useReducedMotion() ?? false

  return (
    <motion.svg
      aria-hidden="true"
      animate={
        shouldReduceMotion
          ? undefined
          : isVisible
            ? { opacity: 1, rotate: [0, 360], scale: 1, y: 0 }
            : { opacity: 0, rotate: 0, scale: 0.9, y: 14 }
      }
      className="size-16 origin-center [transform-box:fill-box] text-[#FF6824] sm:size-20"
      fill="currentColor"
      initial={shouldReduceMotion ? false : { opacity: 0, rotate: 0, scale: 0.9, y: 14 }}
      transition={{
        opacity: { delay, duration: 0.42, ease: 'easeOut' },
        rotate: { delay, duration: 8, ease: 'linear', repeat: Infinity, repeatType: 'loop' },
        scale: { delay, duration: 0.42, ease: 'easeOut' },
        y: { delay, duration: 0.42, ease: 'easeOut' },
      }}
      viewBox="0 0 64 64"
    >
      <path d="M31.6 7.5c3.6-.2 4.1 10.7 5.6 16.1 5.9 1.3 16.6 1.6 17.4 5.2.8 3.7-10.7 5.2-16.3 6.8-1.7 5.4-2.1 16.7-5.7 17.1-3.8.4-4.9-10.6-6.4-16.5-5.5-1.7-16.7-2.1-17.1-5.8-.4-3.8 10.6-4.8 16.3-6.2 1.6-5.6 2.2-16.5 5.8-16.7Z" />
    </motion.svg>
  )
}
