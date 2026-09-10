'use client'

import type { GalleryPhotoSlide } from '@/features/gallery/galleryPhotoSlides'

import { Skiper54 } from '@/shared/ui/primitives/skiper-ui/skiper54'
import { MotionReveal } from '@/shared/components/MotionReveal'
import { cn } from '@/shared/lib/cn'

type GalleryPhotoSliderProps = {
  slides: GalleryPhotoSlide[]
  className?: string
}

export function GalleryPhotoSlider({ slides, className }: GalleryPhotoSliderProps) {
  return (
    <MotionReveal
      amount={0.12}

      className={cn('will-change-[transform,opacity]', className)}
      duration={0.63}
      y={30}
    >
      <Skiper54 slides={slides} />
    </MotionReveal>
  )
}
