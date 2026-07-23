'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

import { cn } from '@/utilities/ui'

type MotionRevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  amount?: number
  once?: boolean
  y?: number
}

export function MotionReveal({
  children,
  className,
  delay = 0,
  duration = 0.7,
  amount = 0.2,
  once = false,
  y = 16,
}: MotionRevealProps) {
  const shouldReduceMotion = useReducedMotion() ?? false

  if (shouldReduceMotion) {
    return <div className={cn(className)}>{children}</div>
  }

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y }}
      transition={{
        delay,
        duration,
        ease: 'easeOut',
      }}
      viewport={{ amount, once }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {children}
    </motion.div>
  )
}
