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
  blur?: number
  allowMobileMotion?: boolean
  once?: boolean
  y?: number
}

export function MotionReveal({
  children,
  className,
  delay = 0,
  duration = 0.47,
  amount = 0.2,
  margin,
  blur = 0,
  allowMobileMotion = false,
  once = false,
  y = 16,
}: MotionRevealProps) {
  const shouldReduceMotion = useReducedMotion() ?? false
  const isMobile = useIsMobileViewport()

  if (shouldReduceMotion) {
    return <div className={cn(className)}>{children}</div>
  }

  const initialState = isMobile
    ? { opacity: 0, y: Math.min(y, 8) }
    : { opacity: 0, y, filter: blur > 0 ? `blur(${blur}px)` : undefined }
  const visibleState = isMobile
    ? { opacity: 1, y: 0 }
    : { opacity: 1, y: 0, filter: 'blur(0px)' }
  const exitState = isMobile
    ? { opacity: 0, y: Math.min(y, 8) }
    : { opacity: 0, y, filter: blur > 0 ? `blur(${blur}px)` : undefined }
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
      viewport={{ amount, margin, once }}
      whileInView={visibleState}
    >
      {children}
    </motion.div>
  )
}
