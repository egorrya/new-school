'use client'

import type { CSSProperties } from 'react'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'

import type { Media as MediaType } from '@/payload-types'

import { Media } from '@/components/shared/Media'
import { cn } from '@/utilities/ui'
import { useIsMobileViewport } from '@/utilities/useIsMobileViewport'

const ROW_COUNT = 4
const MIN_REPEAT_COUNT = 2

type MarqueeStyle = CSSProperties & {
  '--marquee-distance'?: string
  '--marquee-duration'?: string
}

type PhotoEntry = {
  photo: MediaType
  name?: string
}

type TeacherPhotoWallProps = {
  photos: MediaType[]
  names?: string[]
  className?: string
}

function seededShuffle<T>(items: T[], seedKey: string): T[] {
  let seed = 0
  for (let i = 0; i < seedKey.length; i++) {
    seed = (seed * 31 + seedKey.charCodeAt(i)) >>> 0
  }

  const nextRandom = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0
    return seed / 4294967296
  }

  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(nextRandom() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }

  return result
}

function PhotoRow({
  entries,
  hovered,
  reverse,
  offset,
}: {
  entries: PhotoEntry[]
  hovered: boolean
  reverse: boolean
  offset: boolean
}) {
  const isMobile = useIsMobileViewport()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const segmentRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const [repeatCount, setRepeatCount] = useState(MIN_REPEAT_COUNT)
  const [segmentWidth, setSegmentWidth] = useState<number | null>(null)
  const [rowOffset, setRowOffset] = useState(0)

  const entriesKey = entries.map((entry) => entry.photo.id).join('')
  const marqueeDuration = isMobile ? 30 : 42

  useLayoutEffect(() => {
    const container = containerRef.current
    const segment = segmentRef.current

    if (!container || !segment) return

    const measure = () => {
      const containerRect = container.getBoundingClientRect()
      const trackGap = Number.parseFloat(getComputedStyle(trackRef.current ?? segment).columnGap) || 0
      const nextSegmentWidth = segment.getBoundingClientRect().width + trackGap
      const nextContainerWidth = containerRect.width

      if (nextSegmentWidth <= 0 || nextContainerWidth <= 0) return

      const nextRepeatCount = Math.max(
        MIN_REPEAT_COUNT,
        Math.ceil(nextContainerWidth / nextSegmentWidth) + 2,
      )

      setRepeatCount((current) => (current === nextRepeatCount ? current : nextRepeatCount))
      setSegmentWidth((current) =>
        current !== null && Math.abs(current - nextSegmentWidth) < 0.5
          ? current
          : nextSegmentWidth,
      )

      if (offset) {
        const nextRowOffset = ((containerRect.height * 3) / 4) / 2
        setRowOffset((current) =>
          Math.abs(current - nextRowOffset) < 0.5 ? current : nextRowOffset,
        )
      }
    }

    measure()

    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(container)
    resizeObserver.observe(segment)

    return () => {
      resizeObserver.disconnect()
    }
  }, [entriesKey, offset])

  useLayoutEffect(() => {
    const track = trackRef.current
    if (!track) return
    const animationName = reverse ? 'marqueeReverse' : 'marquee'

    const setPlaybackRate = () => {
      const marqueeAnimation = track
        .getAnimations()
        .find(
          (animation) =>
            (animation as Animation & { animationName?: string }).animationName === animationName,
        )

      if (marqueeAnimation) {
        marqueeAnimation.playbackRate = hovered ? -1 : 1
      }
    }

    setPlaybackRate()
    const frameId = requestAnimationFrame(setPlaybackRate)

    return () => cancelAnimationFrame(frameId)
  }, [hovered, reverse])

  const marqueeStyle: MarqueeStyle = {
    '--marquee-duration': `${marqueeDuration}s`,
    ...(segmentWidth ? { '--marquee-distance': `${segmentWidth}px` } : {}),
    ...(offset ? { marginLeft: `-${rowOffset}px` } : {}),
    animationName: reverse ? 'marqueeReverse' : 'marquee',
  }

  return (
    <div className="relative h-full w-full overflow-hidden" ref={containerRef}>
      <div
        className={cn(
          'flex h-full w-max animate-marquee items-stretch gap-1 motion-reduce:animate-none',
        )}
        ref={trackRef}
        style={marqueeStyle}
      >
        {Array.from({ length: repeatCount }).map((_, copyIndex) => (
          <div
            aria-hidden={copyIndex === 0 ? undefined : true}
            className="flex h-full shrink-0 items-stretch gap-1"
            key={copyIndex}
            ref={copyIndex === 0 ? segmentRef : undefined}
          >
            {entries.map((entry, index) => (
              <div
                className="relative aspect-3/4 h-full shrink-0 overflow-hidden"
                key={`${copyIndex}-${entry.photo.id}-${index}`}
              >
                <Media
                  alt={entry.name || entry.photo.alt || ''}
                  disableFadeIn
                  fill
                  htmlElement={null}
                  imgClassName="h-full w-full object-cover"
                  loading="lazy"
                  pictureClassName="absolute inset-0 block h-full w-full"
                  quality={65}
                  resource={entry.photo}
                  size="200px"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function TeacherPhotoWall({ photos, names, className }: TeacherPhotoWallProps) {
  const isMobile = useIsMobileViewport()
  const [hovered, setHovered] = useState(false)
  const rows = useMemo(() => {
    const entries = photos.map((photo, index) => ({ photo, name: names?.[index] }))
    const baseSeed = photos.map((photo) => photo.id).join('-')

    return Array.from({ length: ROW_COUNT }, (_, rowIndex) =>
      seededShuffle(entries, `${baseSeed}-row${rowIndex}`),
    )
  }, [photos, names])

  return (
    <div
      className={cn('group relative w-full overflow-hidden rounded-base bg-background', className)}
      onPointerEnter={isMobile ? undefined : () => setHovered(true)}
      onPointerLeave={isMobile ? undefined : () => setHovered(false)}
    >
      <div
        className={cn(
          'absolute left-1/2 top-1/2 flex h-[170%] w-[170%] flex-col gap-1',
          'opacity-100 transition-transform duration-700 ease-out',
          'transform-[translate(-50%,-50%)_rotate(-25deg)_scale(1.06)]',
          !isMobile && 'group-hover:transform-[translate(-50%,-50%)_rotate(-25deg)_scale(1.1)]',
        )}
      >
        {rows.map((rowEntries, rowIndex) => (
          <div className="min-h-0 flex-1" key={rowIndex}>
            <PhotoRow
              entries={rowEntries}
              hovered={isMobile ? false : hovered}
              offset={rowIndex % 2 === 0}
              reverse={rowIndex % 2 === 1}
            />
          </div>
        ))}
      </div>
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 ease-out',
          !isMobile && 'group-hover:opacity-100',
        )}
        style={{
          background:
            'radial-gradient(circle at 0% 0%, var(--background) 0%, transparent 36%), radial-gradient(circle at 100% 100%, var(--background) 0%, transparent 36%)',
        }}
      />
    </div>
  )
}
