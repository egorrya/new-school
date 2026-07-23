'use client'

import { animate } from 'motion'
import { useEffect, useId, useRef, useState, type CSSProperties, type RefObject } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

import { cn } from '@/utilities/ui'

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
  const hasPointerPositionRef = useRef(false)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const activePatternRef = useRef<SVGPatternElement | null>(null)
  const spotlightRevealRef = useRef({ value: 0 })
  const spotlightRevealTweenRef = useRef<ReturnType<typeof animate> | null>(null)

  useEffect(() => {
    const root = rootRef.current
    const activePattern = activePatternRef.current

    if (!root || !activePattern) {
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
  }, [cellSize, shouldReduceMotion, speed])

  return (
    <div
      ref={rootRef}
      className={cn('pointer-events-none fixed inset-0 -z-10 overflow-hidden', className)}
      aria-hidden="true"
      style={
        {
          '--spotlight-radius': `${spotlightRadius}px`,
          '--spotlight-reveal': 0,
        } as CSSProperties
      }
    >
      <div className="absolute inset-0 bg-background" />

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

      <div className="absolute right-[-20%] top-[-20%] h-[36%] w-[36%] rounded-full bg-[#FB5C18] opacity-100 blur-[110px]" />
      <div className="absolute bottom-[-20%] left-[-14%] h-[36%] w-[36%] rounded-full bg-[#0878BA] opacity-100 blur-[110px]" />
    </div>
  )
}
