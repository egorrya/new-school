'use client'

import { useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react'

import { cn } from '@/utilities/ui'

const minRepeatCount = 2
const marqueeDuration = '24s'
const itemBackgroundColors = [
  '#0878B8',
  '#FD5B19',
  '#FE1922',
  '#03B690',
  '#1B3F7B',
  '#FECA15',
  '#02B692',
]

const marqueeContainerClassName = 'cursor-default overflow-hidden'
const marqueeTrackClassName =
  'flex w-max min-w-full animate-marquee items-center whitespace-nowrap motion-reduce:animate-none'
const marqueeSegmentClassName = 'flex shrink-0 items-center gap-4 py-10 pr-4'
const marqueeItemClassName =
  'inline-flex items-center rounded-full border-2 border-border px-10 py-4 font-heading text-2xl leading-none shadow-shadow motion-reduce:scale-100 sm:text-3xl'

type MarqueeStyle = CSSProperties & {
  '--marquee-distance'?: string
  '--marquee-duration'?: string
}

const getItemTextColor = (backgroundColor: string) => {
  if (backgroundColor.toUpperCase() === '#FECA15') {
    return '#ffffff'
  }

  const hex = backgroundColor.replace('#', '')
  const red = Number.parseInt(hex.slice(0, 2), 16)
  const green = Number.parseInt(hex.slice(2, 4), 16)
  const blue = Number.parseInt(hex.slice(4, 6), 16)
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255

  return luminance > 0.55 ? '#222222' : '#ffffff'
}

export default function Marquee({ className, items }: { className?: string; items: string[] }) {
  return MarqueeBase({ className, items })
}

type MarqueeBaseProps = {
  className?: string
  items: string[]
  paused?: boolean
}

export function MarqueeBase({ className, items, paused = false }: MarqueeBaseProps) {
  const marqueeItems = useMemo(() => items.map((item) => item.trim()).filter(Boolean), [items])
  const marqueeKey = marqueeItems.join('\u0001')
  const containerRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const segmentRef = useRef<HTMLDivElement | null>(null)
  const [repeatCount, setRepeatCount] = useState(minRepeatCount)
  const [segmentWidth, setSegmentWidth] = useState<number | null>(null)

  const setAnimationPlaybackRate = (playbackRate: number) => {
    const track = trackRef.current

    if (!track) {
      return
    }

    for (const animation of track.getAnimations()) {
      animation.updatePlaybackRate(playbackRate)
    }
  }

  useLayoutEffect(() => {
    const container = containerRef.current
    const segment = segmentRef.current

    if (!container || !segment) {
      return
    }

    const measure = () => {
      const nextSegmentWidth = segment.getBoundingClientRect().width
      const nextContainerWidth = container.getBoundingClientRect().width

      if (nextSegmentWidth <= 0 || nextContainerWidth <= 0) {
        return
      }

      const nextRepeatCount = Math.max(
        minRepeatCount,
        Math.ceil(nextContainerWidth / nextSegmentWidth) + 2,
      )

      setRepeatCount((current) => (current === nextRepeatCount ? current : nextRepeatCount))
      setSegmentWidth((current) =>
        current !== null && Math.abs(current - nextSegmentWidth) < 0.5 ? current : nextSegmentWidth,
      )
    }

    measure()

    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(container)
    resizeObserver.observe(segment)

    return () => {
      resizeObserver.disconnect()
    }
  }, [marqueeKey])

  if (marqueeItems.length === 0) {
    return null
  }

  const marqueeStyle: MarqueeStyle | undefined = segmentWidth
    ? {
        '--marquee-distance': `${segmentWidth}px`,
        '--marquee-duration': marqueeDuration,
      }
    : {
        '--marquee-duration': marqueeDuration,
      }

  return (
    <div
      ref={containerRef}
      className={cn(marqueeContainerClassName, className)}
      onPointerEnter={() => setAnimationPlaybackRate(0.25)}
      onPointerLeave={() => setAnimationPlaybackRate(1)}
    >
      <div
        ref={trackRef}
        className={marqueeTrackClassName}
        style={{ ...marqueeStyle, animationPlayState: paused ? 'paused' : 'running' }}
      >
        {Array.from({ length: repeatCount }).map((_, copyIndex) => (
          <div
            aria-hidden={copyIndex === 0 ? undefined : true}
            className={marqueeSegmentClassName}
            key={copyIndex}
            ref={copyIndex === 0 ? segmentRef : undefined}
          >
            {marqueeItems.map((item, index) => {
              const colorIndex =
                (copyIndex * marqueeItems.length + index) % itemBackgroundColors.length
              const backgroundColor = itemBackgroundColors[colorIndex]

              return (
                <span
                  data-marquee-item
                  key={`${copyIndex}-${item}-${index}`}
                  className={marqueeItemClassName}
                  style={{
                    backgroundColor,
                    color: getItemTextColor(backgroundColor),
                  }}
                >
                  {item}
                </span>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
