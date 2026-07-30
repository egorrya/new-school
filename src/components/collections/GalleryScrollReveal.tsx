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
      amount={0.35}

      className={cn('will-change-[transform,opacity]', className)}
      duration={0.5}
      y={24}
    >
      {children}
    </MotionReveal>
  )
}
