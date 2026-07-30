'use client'

import type { ReactNode } from 'react'

import { MotionReveal } from '@/components/shared/MotionReveal'
import { cn } from '@/utilities/ui'

type CollectionGridRevealProps = {
  children: ReactNode
  className?: string
}

export function CollectionGridReveal({ children, className }: CollectionGridRevealProps) {
  return (
    <MotionReveal amount={0.35} className={cn(className)} duration={0.47} y={18}>
      {children}
    </MotionReveal>
  )
}
