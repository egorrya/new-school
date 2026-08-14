'use client'

import { motion } from 'motion/react'
import type { ReactNode } from 'react'

import { cn } from '@/utilities/ui'

type TextEmphasisProps = {
  children: ReactNode
  className?: string
  delay?: number
}

export function TextEmphasis({ children, className, delay = 0.68 }: TextEmphasisProps) {
  return (
    <span className={cn('relative inline-block', className)}>
      <span className="relative z-10">{children}</span>
      <motion.span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-[0.06em] h-[0.045em] origin-left bg-[#f97316]/50"
        initial={{ scaleX: 0 }}
        transition={{ delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ amount: 0.4, once: true }}
        whileInView={{ scaleX: 1 }}
      />
    </span>
  )
}
