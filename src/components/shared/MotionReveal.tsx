'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

import { cn } from '@/utilities/ui'
import { useIsMobileViewport } from '@/utilities/useIsMobileViewport'

type MarginValue = `${number}${'px' | '%'}`
type MarginType =
  | MarginValue
  | `${MarginValue} ${MarginValue}`
  | `${MarginValue} ${MarginValue} ${MarginValue}`
  | `${MarginValue} ${MarginValue} ${MarginValue} ${MarginValue}`

type MotionRevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  amount?: number
  margin?: MarginType
  allowMobileMotion?: boolean
  once?: boolean
  y?: number
}

// Keep viewport reveals responsive on first paint even when a caller requests
// a large intersection threshold for a tall element.
const MAX_VIEWPORT_REVEAL_AMOUNT = 0.08
const MOBILE_VIEWPORT_MARGIN = '0px 0px -5% 0px'

export function MotionReveal({
  children,
  className,
  delay = 0,
  duration = 0.47,
  amount = MAX_VIEWPORT_REVEAL_AMOUNT,
  margin = '-10% 0px -10% 0px',
  allowMobileMotion = false,
  once = false,
  y = 16,
}: MotionRevealProps) {
  const shouldReduceMotion = useReducedMotion() ?? false
  const isMobile = useIsMobileViewport()
  const viewportAmount = Math.min(amount, MAX_VIEWPORT_REVEAL_AMOUNT)
  const viewportMargin = isMobile ? MOBILE_VIEWPORT_MARGIN : margin
  const viewportOnce = isMobile || once

  if (shouldReduceMotion) {
    return <div className={cn(className)}>{children}</div>
  }

  const initialState = isMobile
    ? { opacity: 0, y: Math.min(y, 8) }
    : { opacity: 0, y }
  const visibleState = isMobile
    ? { opacity: 1, y: 0 }
    : { opacity: 1, y: 0 }
  const exitState = isMobile
    ? { opacity: 0, y: Math.min(y, 8) }
    : { opacity: 0, y }
  const revealTransition = isMobile
    ? {
        delay: allowMobileMotion ? Math.min(delay, 0.14) : Math.min(delay, 0.1),
        duration: Math.min(duration, 0.3),
        ease: 'easeOut' as const,
      }
    : {
        delay,
        duration,
        ease: 'easeOut' as const,
      }

  return (
    <motion.div
      className={cn(className)}
      initial={initialState}
      transition={revealTransition}
      exit={exitState}
      viewport={{ amount: viewportAmount, margin: viewportMargin, once: viewportOnce }}
      whileInView={visibleState}
    >
      {children}
    </motion.div>
  )
}
