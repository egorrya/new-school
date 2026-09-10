'use client'

import type { ReactNode } from 'react'

import { MotionReveal } from '@/shared/components/MotionReveal'
import { cn } from '@/shared/lib/cn'

type CollectionGridRevealProps = {
  children: ReactNode
  className?: string
}

export function CollectionGridReveal({ children, className }: CollectionGridRevealProps) {
  return (
    <MotionReveal amount={0.12} className={cn(className)} duration={0.47} y={18}>
      {children}
    </MotionReveal>
  )
}
