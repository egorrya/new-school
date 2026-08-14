'use client'

import { motion, useReducedMotion } from 'motion/react'

export function SchoolLifeDivider() {
  const shouldReduceMotion = useReducedMotion() ?? false

  if (shouldReduceMotion) {
    return <div aria-hidden="true" className="h-px bg-foreground/90" />
  }

  return (
    <motion.div
      aria-hidden="true"
      className="h-px origin-left bg-foreground/90"
      initial={{ opacity: 0.2, scaleX: 0 }}
      transition={{ duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ amount: 0.55, once: false }}
      whileInView={{ opacity: 1, scaleX: 1 }}
    />
  )
}
