import type { ReactNode } from 'react'

import { MotionReveal } from '@/shared/components/MotionReveal'

type BlockRevealProps = {
  children: ReactNode
  className?: string
  insideTabs?: boolean | null
}

// Tab panels themselves stay static. Content inside them uses MotionReveal,
// whose tab context applies a shared, scroll-based entrance threshold.
export function BlockReveal({ children, className, insideTabs }: BlockRevealProps) {
  if (insideTabs) {
    return <MotionReveal className={className}>{children}</MotionReveal>
  }

  return (
    <MotionReveal amount={0.12} className={className} duration={0.47} y={18}>
      {children}
    </MotionReveal>
  )
}
