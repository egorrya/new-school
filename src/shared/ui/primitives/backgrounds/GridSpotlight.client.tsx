'use client'

import { useEffect, useRef } from 'react'

type GridSpotlightProps = {
  cellSize: number
}

const POINTER_MEDIA_QUERY = '(hover: hover) and (pointer: fine)'

export function GridSpotlight({ cellSize }: GridSpotlightProps) {
  const spotlightRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const spotlight = spotlightRef.current
    const mediaQuery = window.matchMedia(POINTER_MEDIA_QUERY)

    if (!spotlight) {
      return
    }

    const onPointerMove = (event: PointerEvent) => {
      spotlight.style.setProperty('--grid-pointer-x', `${event.clientX}px`)
      spotlight.style.setProperty('--grid-pointer-y', `${event.clientY}px`)
      spotlight.style.opacity = '1'
      spotlight.dataset.active = 'true'
    }

    const syncPointerListener = () => {
      window.removeEventListener('pointermove', onPointerMove)

      if (mediaQuery.matches) {
        window.addEventListener('pointermove', onPointerMove, { passive: true })
      } else {
        spotlight.style.opacity = '0'
        delete spotlight.dataset.active
      }
    }

    syncPointerListener()
    mediaQuery.addEventListener('change', syncPointerListener)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      mediaQuery.removeEventListener('change', syncPointerListener)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      className="grid-spotlight pointer-events-none absolute inset-0 hidden overflow-hidden opacity-0 transition-opacity duration-700 sm:block"
      ref={spotlightRef}
      style={{
        maskImage:
          'radial-gradient(420px circle at var(--grid-pointer-x, 50%) var(--grid-pointer-y, 50%), black 0%, transparent 72%)',
        WebkitMaskImage:
          'radial-gradient(420px circle at var(--grid-pointer-x, 50%) var(--grid-pointer-y, 50%), black 0%, transparent 72%)',
      }}
    >
      <div
        className="grid-spotlight-cells absolute -inset-10"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgb(34 34 34 / 0.14) 1px, transparent 1px), linear-gradient(to bottom, rgb(34 34 34 / 0.14) 1px, transparent 1px)',
          backgroundSize: `${cellSize}px ${cellSize}px`,
        }}
      />
    </div>
  )
}
