'use client'

import type { CSSProperties } from 'react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

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

const GALLERY_START_DELAY = 0.95

export function HeroMarqueeImages({ images, className }: HeroMarqueeImagesProps) {
  const isMobile = useIsMobileViewport()
  const shouldReduceMotion = useReducedMotion() ?? false
  const containerRef = useRef<HTMLDivElement | null>(null)
  const segmentRef = useRef<HTMLDivElement | null>(null)
  const [repeatCount, setRepeatCount] = useState(minRepeatCount)
  const [segmentWidth, setSegmentWidth] = useState<number | null>(null)
  const [galleryVisible, setGalleryVisible] = useState(false)

  const imagesKey = images.map((image) => image.id).join('')
  const marqueeDuration = isMobile ? 28 : 36
  const galleryIsVisible = galleryVisible || shouldReduceMotion

  useEffect(() => {
    if (typeof window === 'undefined' || shouldReduceMotion) {
      return
    }

    const timer = window.setTimeout(() => setGalleryVisible(true), GALLERY_START_DELAY * 1000)

    return () => window.clearTimeout(timer)
  }, [shouldReduceMotion])

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
    }

    measure()

    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(container)
    resizeObserver.observe(segment)

    return () => {
      resizeObserver.disconnect()
    }
  }, [imagesKey])

  const marqueeStyle: MarqueeStyle = {
    '--marquee-duration': `${marqueeDuration}s`,
    ...(segmentWidth ? { '--marquee-distance': `${segmentWidth}px` } : {}),
  }

  return (
    <motion.div
      className={cn(
        'overflow-x-hidden py-2 mask-[linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] sm:py-3',
        className,
      )}
      animate={
        galleryIsVisible
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: 6 }
      }
      initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
      ref={containerRef}
      transition={{
        duration: shouldReduceMotion ? 0 : 1.15,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      <div
        className={cn(
          'flex w-max min-w-full items-stretch gap-1 motion-reduce:animate-none sm:gap-2',
          'animate-marquee',
        )}
        style={marqueeStyle}
      >
        {Array.from({ length: repeatCount }).map((_, copyIndex) => (
          <div
            aria-hidden={copyIndex === 0 ? undefined : true}
            className="flex shrink-0 items-stretch gap-1 sm:gap-2"
            key={copyIndex}
            ref={copyIndex === 0 ? segmentRef : undefined}
          >
            {images.map((image, index) => {
              return (
                <div
                  className="h-44 shrink-0 overflow-hidden rounded-base shadow-shadow sm:h-56 lg:h-72"
                  key={`${copyIndex}-${image.id}-${index}`}
                >
                  <Media
                    className="h-full"
                    disableFadeIn
                    imgClassName="h-full w-auto object-contain"
                    loading={copyIndex === 0 ? 'eager' : 'lazy'}
                    priority={copyIndex === 0 && index < 2}
                    quality={75}
                    resource={image}
                    size="(max-width: 640px) 200px, (max-width: 1024px) 260px, 340px"
                  />
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </motion.div>
  )
}
