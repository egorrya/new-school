'use client'

import type { CSSProperties } from 'react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import type { Media as MediaType } from '@/payload-types'

import { Media } from '@/components/shared/Media'
import { cn } from '@/utilities/ui'
import { useIsMobileViewport } from '@/utilities/useIsMobileViewport'

const minRepeatCount = 2

type MarqueeStyle = CSSProperties & {
  '--marquee-distance'?: string
  '--marquee-duration'?: string
}

type HeroMarqueeImagesProps = {
  images: MediaType[]
  className?: string
}

export function HeroMarqueeImages({ images, className }: HeroMarqueeImagesProps) {
  const isMobile = useIsMobileViewport()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const segmentRef = useRef<HTMLDivElement | null>(null)
  const [repeatCount, setRepeatCount] = useState(minRepeatCount)
  const [segmentWidth, setSegmentWidth] = useState<number | null>(null)
  const [containerWidth, setContainerWidth] = useState<number | null>(null)
  const [introStarted, setIntroStarted] = useState(false)
  const [introDone, setIntroDone] = useState(false)
  const [skipIntro, setSkipIntro] = useState(false)

  const imagesKey = images.map((image) => image.id).join('')
  const marqueeDuration = isMobile ? 28 : 36

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setSkipIntro(true)
      setIntroStarted(true)
      setIntroDone(true)
    }
  }, [])

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
        current !== null && Math.abs(current - nextSegmentWidth) < 0.5
          ? current
          : nextSegmentWidth,
      )
      setContainerWidth((current) =>
        current !== null && Math.abs(current - nextContainerWidth) < 0.5
          ? current
          : nextContainerWidth,
      )
    }

    measure()

    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(container)
    resizeObserver.observe(segment)

    return () => {
      resizeObserver.disconnect()
    }
  }, [imagesKey])

  // Start the entrance slide only once we know the real container width, so it
  // travels at the exact same px/s speed as the infinite loop that follows it.
  useEffect(() => {
    if (skipIntro || introStarted || containerWidth === null || segmentWidth === null) {
      return
    }

    const raf = requestAnimationFrame(() => setIntroStarted(true))
    return () => cancelAnimationFrame(raf)
  }, [skipIntro, introStarted, containerWidth, segmentWidth])

  const speed = segmentWidth ? segmentWidth / marqueeDuration : null
  const introDuration = speed && containerWidth ? containerWidth / speed : marqueeDuration * 0.4

  const marqueeStyle: MarqueeStyle = {
    '--marquee-duration': `${marqueeDuration}s`,
    ...(segmentWidth ? { '--marquee-distance': `${segmentWidth}px` } : {}),
    ...(!introDone
      ? {
          transform: introStarted ? 'translate3d(0, 0, 0)' : 'translate3d(100vw, 0, 0)',
          transition: introStarted ? `transform ${introDuration}s linear` : undefined,
        }
      : {}),
  }

  return (
    <div
      className={cn(
        'overflow-x-hidden py-2 mask-[linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] sm:py-3',
        className,
      )}
      ref={containerRef}
    >
      <div
        className={cn(
          'flex w-max min-w-full items-stretch gap-1 motion-reduce:animate-none sm:gap-2',
          introDone && 'animate-marquee',
        )}
        onTransitionEnd={(event) => {
          if (event.propertyName === 'transform' && introStarted && !introDone) {
            setIntroDone(true)
          }
        }}
        style={marqueeStyle}
      >
        {Array.from({ length: repeatCount }).map((_, copyIndex) => (
          <div
            aria-hidden={copyIndex === 0 ? undefined : true}
            className="flex shrink-0 items-stretch gap-1 sm:gap-2"
            key={copyIndex}
            ref={copyIndex === 0 ? segmentRef : undefined}
          >
            {images.map((image, index) => (
              <div
                className="h-44 shrink-0 overflow-hidden rounded-base shadow-shadow sm:h-56 lg:h-72"
                key={`${copyIndex}-${image.id}-${index}`}
              >
                <Media
                  className="h-full"
                  imgClassName="h-full w-auto object-contain"
                  loading={copyIndex === 0 ? 'eager' : 'lazy'}
                  priority={copyIndex === 0 && index < 2}
                  quality={75}
                  resource={image}
                  size="(max-width: 640px) 200px, (max-width: 1024px) 260px, 340px"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
