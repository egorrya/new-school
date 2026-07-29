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

  if (shouldReduceMotion || (isMobile && !allowMobileMotion)) {
    return <div className={cn(className)}>{children}</div>
  }

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y, filter: blur > 0 ? `blur(${blur}px)` : undefined }}
      transition={{
        delay,
        duration,
        ease: 'easeOut',
      }}
      exit={{ opacity: 0, y, filter: blur > 0 ? `blur(${blur}px)` : undefined }}
      viewport={{ amount, margin, once }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    >
      {children}
    </motion.div>
  )
}
