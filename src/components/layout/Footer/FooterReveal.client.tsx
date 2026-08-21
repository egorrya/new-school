'use client'

import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'

import { cn } from '@/utilities/ui'
import { useIsMobileViewport } from '@/utilities/useIsMobileViewport'
import { FooterMark } from './FooterMark.client'

type FooterRevealProps = {
  className?: string
  brand: ReactNode
  navigation: ReactNode
  legal: ReactNode
}

/**
 * Reference "curtain reveal" mechanic, ported from GSAP ScrollTrigger to
 * motion/react: from `sm` upward the footer is genuinely `position: fixed`
 * to the viewport bottom (a fixed element never contributes height to its
 * parent, so the wrapper reserves scroll room explicitly via its measured
 * height). On smaller screens it returns to normal document flow: otherwise
 * a tall footer starts above the viewport and is obscured by the fixed header.
 */
export function FooterReveal({ className, brand, navigation, legal }: FooterRevealProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLElement>(null)
  const [footerHeight, setFooterHeight] = useState(0)
  const shouldReduceMotion = useReducedMotion() ?? false
  const isMobile = useIsMobileViewport()

  useLayoutEffect(() => {
    const el = footerRef.current

    if (!el) {
      return
    }

    const updateHeight = () => setFooterHeight(el.offsetHeight)
    updateHeight()

    const resizeObserver = new ResizeObserver(updateHeight)
    resizeObserver.observe(el)

    return () => resizeObserver.disconnect()
  }, [])

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start end', 'end end'],
  })

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1])

  // The footer is `fixed`, so it's always technically in the viewport;
  // `wrapperRef` is the in-flow placeholder that actually scrolls, so it's
  // what tells us whether the curtain has scrolled away enough to reveal it.
  // The wordmark replays on desktop when returning to the footer. On mobile,
  // it reveals once to avoid repeating a long letter sequence while reading.
  const markInView = useInView(wrapperRef, { amount: 0.15, once: isMobile })

  return (
    <div className="relative" ref={wrapperRef} style={{ height: footerHeight || undefined }}>
      <footer className={cn('relative inset-x-0 bottom-0 sm:fixed', className)} ref={footerRef}>
        <div className="container py-8 sm:py-10 lg:py-12">
          <motion.div
            className="grid gap-8 max-sm:!opacity-100 lg:grid-cols-[1.1fr_0.9fr_0.9fr]"
            style={shouldReduceMotion ? undefined : { opacity }}
          >
            <div className="hidden sm:block">{brand}</div>
            <div className="min-w-0 max-w-xs">{navigation}</div>
            <div>{legal}</div>
          </motion.div>
        </div>
        <FooterMark inView={markInView} />
      </footer>
    </div>
  )
}
