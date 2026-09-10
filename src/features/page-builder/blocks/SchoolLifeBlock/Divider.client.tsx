'use client'

import { motion, useReducedMotion } from 'motion/react'

type SchoolLifeDividerProps = {
  delay?: number
  isVisible?: boolean
}

export function SchoolLifeDivider({ delay = 0, isVisible = true }: SchoolLifeDividerProps) {
  const shouldReduceMotion = useReducedMotion() ?? false

  if (shouldReduceMotion) {
    return <div aria-hidden="true" className="h-px bg-foreground/90" />
  }

  return (
    <motion.div
      aria-hidden="true"
      className="h-px origin-left bg-foreground/90"
      animate={isVisible ? { opacity: 1, scaleX: 1 } : { opacity: 0.2, scaleX: 0 }}
      initial={{ opacity: 0.2, scaleX: 0 }}
      transition={{ delay, duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
    />
  )
}
