'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'

import type { Media as MediaType } from '@/payload-types'

import { Media } from '@/components/shared/Media'
import { cn } from '@/utilities/ui'

type ClubCoverImagePosition = 'top' | 'center' | 'bottom'

type ClubCoverImageProps = {
  alt: string
  resource: MediaType | number | null | undefined
  className?: string
  position?: ClubCoverImagePosition | null
}

const objectPositionClasses: Record<ClubCoverImagePosition, string> = {
  top: 'object-top',
  center: 'object-center',
  bottom: 'object-bottom',
}

export function ClubCoverImage({ alt, resource, className, position }: ClubCoverImageProps) {
  const objectPositionClass = objectPositionClasses[position ?? 'center'] ?? objectPositionClasses.center
  const containerRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion() ?? false

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['-25%', '25%'])

  return (
    <div
      className={cn('relative h-48 w-full overflow-hidden rounded-base sm:h-64 lg:h-80', className)}
      ref={containerRef}
    >
      <motion.div
        className="absolute inset-x-0 top-[-30%] h-[160%]"
        style={shouldReduceMotion ? undefined : { y }}
      >
        <Media
          alt={alt}
          fill
          htmlElement={null}
          imgClassName={cn('h-full w-full object-cover', objectPositionClass)}
          pictureClassName="relative block h-full w-full"
          priority
          resource={resource}
          videoClassName={cn('absolute inset-0 h-full w-full object-cover', objectPositionClass)}
        />
      </motion.div>
    </div>
  )
}
