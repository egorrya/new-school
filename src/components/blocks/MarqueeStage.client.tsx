'use client'

import type { TargetAndTransition, Transition } from 'motion/react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { useRef, useSyncExternalStore } from 'react'

import Marquee from '@/components/ui/marquee'

type MarqueeStageProps = {
  items: string[]
  className?: string
}

const hiddenClipPath = 'polygon(0 0, 0 0, 0 100%, 0 100%)'
const visibleClipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
const mobileQuery = '(max-width: 639.98px)'
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

function subscribeToMobileQuery(onStoreChange: () => void) {
  if (typeof window === 'undefined') {
    return () => undefined
  }

  const query = window.matchMedia(mobileQuery)
  query.addEventListener('change', onStoreChange)

  return () => query.removeEventListener('change', onStoreChange)
}

function getMobileQuerySnapshot() {
  return typeof window !== 'undefined' && window.matchMedia(mobileQuery).matches
}

function getServerMobileQuerySnapshot() {
  return true
}

export function MarqueeStage({ items, className }: MarqueeStageProps) {
  const shouldReduceMotion = useReducedMotion() ?? false
  const isMobile = useSyncExternalStore(
    subscribeToMobileQuery,
    getMobileQuerySnapshot,
    getServerMobileQuerySnapshot,
  )
  const rootRef = useRef<HTMLDivElement | null>(null)
  const inView = useInView(rootRef, {
    amount: 0.35,
    margin: '0px 0px -25% 0px',
    once: false,
  })

  if (shouldReduceMotion || isMobile) {
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
