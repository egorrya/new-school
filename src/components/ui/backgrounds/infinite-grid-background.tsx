'use client'

import { animate } from 'motion'
import { useEffect, useId, useRef, useState, type CSSProperties, type RefObject } from 'react'
import { motion, useReducedMotion } from 'motion/react'

import { cn } from '@/utilities/ui'
import { useIsMobileViewport } from '@/utilities/useIsMobileViewport'

type InfiniteGridBackgroundProps = {
  className?: string
  cellSize?: number
  spotlightRadius?: number
  speed?: number
}

type GridPatternProps = {
  id: string
  patternRef: RefObject<SVGPatternElement | null>
}

function GridPattern({ id, patternRef }: GridPatternProps) {
  return (
    <svg className="h-full w-full" aria-hidden="true">
      <defs>
        <pattern ref={patternRef} id={id} width="40" height="40" patternUnits="userSpaceOnUse">
          <rect
            x="0"
            y="0"
            width="40"
            height="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

/**
 * This is meant to be rendered as the first child inside `main`, not as a
 * viewport-fixed sibling — that's deliberate. `main` is the layer that has to
 * stay opaque and scroll away for the footer reveal to work (see
 * FooterReveal.client.tsx); a *globally* fixed background can never scroll
 * away, so it would either permanently hide the footer (if stacked above it)
 * or bleed through the footer's transparent gaps (if stacked below main
 * without main covering it). Scoping it to `main` sidesteps that entirely —
 * it's `main`'s own background, so once `main` ends, it's simply gone,
 * leaving the footer on its own plain background.
 *
 * This has to be `position: sticky` with a *genuine* `h-screen` height, not
 * a zero-height trick — verified empirically: a zero-height (or
 * height-cancelled-by-margin) sticky element never releases from "stuck",
 * because sticky's release is computed from the element's own real box
 * overflowing its containing block, and a box with no net height never
 * overflows anything. With a real height it releases correctly right as
 * `main` ends. The `-100vh` it would otherwise push into the flow gets
 * cancelled by a matching `marginTop: '-100vh'` on the sibling that wraps
 * `main`'s real content (see layout.tsx) instead of on this element itself.
 */
export function InfiniteGridBackground({
  className,
  cellSize = 40,
  spotlightRadius = 420,
  speed = 0.35,
}: InfiniteGridBackgroundProps) {
  const patternId = useId().replace(/:/g, '')
  const spotlightMask =
    'radial-gradient(calc(var(--spotlight-radius) * var(--spotlight-reveal, 0)) circle at var(--mouse-x) var(--mouse-y), black 0%, transparent 72%)'
  const [hasPointerPosition, setHasPointerPosition] = useState(false)
  const shouldReduceMotion = useReducedMotion() ?? false
  const isMobile = useIsMobileViewport()
  const hasPointerPositionRef = useRef(false)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const activePatternRef = useRef<SVGPatternElement | null>(null)
  const spotlightRevealRef = useRef({ value: 0 })
  const spotlightRevealTweenRef = useRef<ReturnType<typeof animate> | null>(null)

  useEffect(() => {
    const root = rootRef.current
    const activePattern = activePatternRef.current

    if (isMobile || !root || !activePattern) {
      return
    }

    let offsetX = 0
    let offsetY = 0
    let frame = 0
    let hasStartedReveal = false

    const syncPointer = (clientX: number, clientY: number) => {
      root.style.setProperty('--mouse-x', `${clientX}px`)
      root.style.setProperty('--mouse-y', `${clientY}px`)
    }

    const animateSpotlightReveal = () => {
      spotlightRevealTweenRef.current?.stop()
      spotlightRevealRef.current.value = 0

      spotlightRevealTweenRef.current = animate(
        spotlightRevealRef.current,
        { value: 1 },
        {
          duration: 0.85,
          ease: 'easeOut',
          onUpdate: () => {
            root.style.setProperty('--spotlight-reveal', `${spotlightRevealRef.current.value}`)
          },
        },
      )
    }

    const startReveal = () => {
      if (hasStartedReveal) {
        return
      }

      hasStartedReveal = true
      animateSpotlightReveal()
    }

    const applyOffsets = () => {
      activePattern.setAttribute('patternTransform', `translate(${offsetX} ${offsetY})`)
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!hasPointerPositionRef.current) {
        hasPointerPositionRef.current = true
        setHasPointerPosition(true)
        startReveal()
      }
      syncPointer(event.clientX, event.clientY)
    }

    const tick = () => {
      offsetX = (offsetX + speed) % cellSize
      offsetY = (offsetY + speed) % cellSize
      applyOffsets()
      frame = window.requestAnimationFrame(tick)
    }

    applyOffsets()
    window.addEventListener('pointermove', onPointerMove, { passive: true })

    if (!shouldReduceMotion) {
      frame = window.requestAnimationFrame(tick)
    }

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      if (frame !== 0) {
        window.cancelAnimationFrame(frame)
      }
      spotlightRevealTweenRef.current?.stop()
      spotlightRevealTweenRef.current = null
    }
  }, [cellSize, isMobile, shouldReduceMotion, speed])

  return (
    <div
      ref={rootRef}
      className={cn('pointer-events-none sticky top-0 h-screen overflow-hidden', className)}
      aria-hidden="true"
      style={
        {
          '--spotlight-radius': `${spotlightRadius}px`,
          '--spotlight-reveal': 0,
        } as CSSProperties
      }
    >
      {isMobile ? (
        <div
          className="absolute inset-0"
          style={{
            color: 'rgb(34 34 34 / 0.08)',
          }}
        >
          <GridPattern id={`${patternId}-mobile`} patternRef={activePatternRef} />
        </div>
      ) : (
      <motion.div
        className="background-effects animate-background-drift absolute inset-0 scale-[1.02] motion-reduce:scale-100"
        initial={shouldReduceMotion ? false : { scale: 1.02 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        viewport={{ amount: 0, once: true }}
        whileInView={shouldReduceMotion ? undefined : { scale: 1 }}
        style={{
          color: 'rgb(34 34 34 / 0.14)',
          opacity: hasPointerPosition ? 1 : 0,
          transformOrigin: '50% 50%',
          maskImage: spotlightMask,
          WebkitMaskImage: spotlightMask,
        }}
      >
        <GridPattern id={`${patternId}-active`} patternRef={activePatternRef} />
      </motion.div>
      )}

      {!isMobile ? (
      <motion.div
        className="absolute right-[-20%] top-[-20%] h-[36%] w-[36%] rounded-full bg-[#FB5C18] opacity-100 blur-[110px]"
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.5 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1, scale: [0.5, 1.5, 0.5] }}
        transition={
          shouldReduceMotion
            ? undefined
            : {
                opacity: { duration: 1.2, ease: 'easeOut' },
                scale: { duration: 18, ease: 'easeInOut', repeat: Infinity },
              }
        }
      />
      ) : null}
      {!isMobile ? (
      <motion.div
        className="absolute bottom-[-20%] left-[-14%] h-[36%] w-[36%] rounded-full bg-[#0878BA] opacity-100 blur-[110px]"
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 1.5 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1, scale: [1.5, 0.5, 1.5] }}
        transition={
          shouldReduceMotion
            ? undefined
            : {
                opacity: { duration: 1.2, ease: 'easeOut', delay: 0.15 },
                scale: { duration: 18, ease: 'easeInOut', repeat: Infinity },
              }
        }
      />
      ) : null}
    </div>
  )
}
