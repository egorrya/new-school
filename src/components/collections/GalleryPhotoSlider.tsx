'use client'

import type { GalleryPhotoSlide } from '@/components/collections/galleryPhotoSlides'

import { Skiper54 } from '@/components/ui/skiper-ui/skiper54'
import { MotionReveal } from '@/components/shared/MotionReveal'
import { cn } from '@/utilities/ui'

type GalleryPhotoSliderProps = {
  slides: GalleryPhotoSlide[]
  className?: string
}

export function GalleryPhotoSlider({ slides, className }: GalleryPhotoSliderProps) {
  return (
    <MotionReveal
      amount={0.35}

      className={cn('will-change-[transform,opacity]', className)}
      duration={0.63}
      y={30}
    >
      <Skiper54 slides={slides} />
    </MotionReveal>
  )
}
