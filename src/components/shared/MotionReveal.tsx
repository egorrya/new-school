'use client'

import { motion, useReducedMotion } from 'motion/react'
import { createContext, useContext, useRef } from 'react'
import type { ReactNode } from 'react'

import { cn } from '@/utilities/ui'
import { useIsMobileViewport } from '@/utilities/useIsMobileViewport'
import { useScrollRevealVisibility } from '@/utilities/useScrollRevealVisibility'

type MarginValue = `${number}${'px' | '%'}`
type MarginType =
  | MarginValue
  | `${MarginValue} ${MarginValue}`
  | `${MarginValue} ${MarginValue} ${MarginValue}`
  | `${MarginValue} ${MarginValue} ${MarginValue} ${MarginValue}`

type MotionRevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  amount?: number
  margin?: MarginType
  allowMobileMotion?: boolean
  once?: boolean
  y?: number
}

const TabContentMotionContext = createContext(false)

// A zero intersection threshold makes the reveal depend on the position of an
// element's top edge, rather than on a percentage of the element's own height.
const TAB_CONTENT_VIEWPORT_MARGIN = '0px 0px -10% 0px'

export function TabContentMotionProvider({ children }: { children: ReactNode }) {
  return <TabContentMotionContext.Provider value={true}>{children}</TabContentMotionContext.Provider>
}

// Keep viewport reveals responsive on first paint even when a caller requests
// a large intersection threshold for a tall element.
const MAX_VIEWPORT_REVEAL_AMOUNT = 0.08
const MOBILE_VIEWPORT_MARGIN = '0px 0px -5% 0px'

export function MotionReveal({
  children,
  className,
  delay = 0,
  duration = 0.47,
  amount = MAX_VIEWPORT_REVEAL_AMOUNT,
  margin = '-10% 0px -10% 0px',
  allowMobileMotion = false,
  once = false,
  y = 16,
}: MotionRevealProps) {
  const shouldReduceMotion = useReducedMotion() ?? false
  const isMobile = useIsMobileViewport()
  const isInsideTabContent = useContext(TabContentMotionContext)
  const viewportAmount = isInsideTabContent ? 0 : Math.min(amount, MAX_VIEWPORT_REVEAL_AMOUNT)
  const viewportMargin = isInsideTabContent
    ? TAB_CONTENT_VIEWPORT_MARGIN
    : isMobile
      ? MOBILE_VIEWPORT_MARGIN
      : margin
  const revealRef = useRef<HTMLDivElement>(null)
  const isVisible = useScrollRevealVisibility(revealRef, {
    amount: viewportAmount,
    margin: viewportMargin,
    once,
  })

  if (shouldReduceMotion) {
    return <div className={cn(className)}>{children}</div>
  }

  const initialState = isMobile
    ? { opacity: 0, y: Math.min(y, 8) }
    : { opacity: 0, y }
  const visibleState = isMobile
    ? { opacity: 1, y: 0 }
    : { opacity: 1, y: 0 }
  const exitState = isMobile
    ? { opacity: 0, y: Math.min(y, 8) }
    : { opacity: 0, y }
  const revealTransition = isMobile
    ? {
        delay: allowMobileMotion ? Math.min(delay, 0.14) : Math.min(delay, 0.1),
        duration: Math.min(duration, 0.3),
        ease: 'easeOut' as const,
      }
    : {
        delay,
        duration,
        ease: 'easeOut' as const,
      }

  return (
    <motion.div
      className={cn(className)}
      animate={isVisible ? visibleState : exitState}
      initial={initialState}
      ref={revealRef}
      transition={revealTransition}
      exit={exitState}
    >
      {children}
    </motion.div>
  )
}
