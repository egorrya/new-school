'use client'

import type { TargetAndTransition, Transition } from 'framer-motion'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'

import Marquee from '@/components/ui/marquee'

type MarqueeStageProps = {
  items: string[]
  className?: string
}

const hiddenClipPath = 'polygon(0 0, 0 0, 0 100%, 0 100%)'
const visibleClipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
const hiddenRevealState = {
  clipPath: hiddenClipPath,
  WebkitClipPath: hiddenClipPath,
} as TargetAndTransition
const visibleRevealState = {
  clipPath: visibleClipPath,
  WebkitClipPath: visibleClipPath,
} as TargetAndTransition
const revealTransition = {
  clipPath: {
    duration: 2.15,
    ease: [0.22, 1, 0.36, 1],
  },
  WebkitClipPath: {
    duration: 2.15,
    ease: [0.22, 1, 0.36, 1],
  },
} as Transition

export function MarqueeStage({ items, className }: MarqueeStageProps) {
  const shouldReduceMotion = useReducedMotion() ?? false
  const rootRef = useRef<HTMLDivElement | null>(null)
  const inView = useInView(rootRef, {
    amount: 0.35,
    once: false,
  })

  if (shouldReduceMotion) {
    return (
      <div className="relative isolate overflow-hidden" ref={rootRef}>
        <Marquee className={className} items={items} />
      </div>
    )
  }

  return (
    <div ref={rootRef} className="relative isolate overflow-hidden">
      <motion.div
        initial={hiddenRevealState}
        animate={inView ? visibleRevealState : hiddenRevealState}
        transition={revealTransition}
        style={{
          willChange: 'clip-path',
        }}
      >
        <Marquee className={className} items={items} />
      </motion.div>
    </div>
  )
}
