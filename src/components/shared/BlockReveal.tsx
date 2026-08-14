import type { ReactNode } from 'react'

import { MotionReveal } from '@/components/shared/MotionReveal'

type BlockRevealProps = {
  children: ReactNode
  className?: string
  insideTabs?: boolean | null
}

// Inside a tab panel, entrance timing is already driven by the panel's own
// scroll-linked fade (TabsBlockClient), so every block in it stays visually in
// sync. Adding a second, independently triggered reveal on top of that caused
// blocks lower on the page to sometimes appear before the ones above them.
export function BlockReveal({ children, className, insideTabs }: BlockRevealProps) {
  if (insideTabs) {
    return <div className={className}>{children}</div>
  }

  return (
    <MotionReveal amount={0.12} className={className} duration={0.47} y={18}>
      {children}
    </MotionReveal>
  )
}
