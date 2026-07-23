'use client'

import type { ReactNode } from 'react'

import { MotionReveal } from '@/components/shared/MotionReveal'
import { cn } from '@/utilities/ui'

type GalleryScrollRevealProps = {
  children: ReactNode
  className?: string
}

export function GalleryScrollReveal({ children, className }: GalleryScrollRevealProps) {
  return (
    <MotionReveal
      amount={0.2}
      className={cn('will-change-transform', className)}
      duration={1.05}
      y={24}
    >
      {children}
    </MotionReveal>
  )
}
