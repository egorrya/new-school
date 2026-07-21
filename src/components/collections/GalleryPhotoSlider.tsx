import type { GalleryAlbum, Media as MediaDocument } from '@/payload-types'

import { Badge } from '@/components/ui/badge'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { MediaFrame } from '@/components/shared/MediaFrame'

import { cn } from '@/utilities/ui'

export type GalleryPhotoSlide = {
  id: string
  image: MediaDocument
  albumTitle?: string | null
}

export function buildGalleryPhotoSlides(
  albums: GalleryAlbum[],
  limit?: number,
): GalleryPhotoSlide[] {
  const slides: GalleryPhotoSlide[] = []

  for (const album of albums) {
    const images = album.images?.filter(
      (image): image is MediaDocument => typeof image === 'object' && image !== null,
    )

    if (!images?.length) {
      continue
    }

    for (const [index, image] of images.entries()) {
      slides.push({
        id: `${album.id}-${image.id ?? index}`,
        albumTitle: album.title,
        image,
      })

      if (typeof limit === 'number' && slides.length >= limit) {
        return slides
      }
    }
  }

  return slides
}

type GalleryPhotoSliderProps = {
  slides: GalleryPhotoSlide[]
  className?: string
}

export function GalleryPhotoSlider({ slides, className }: GalleryPhotoSliderProps) {
  if (slides.length === 0) {
    return null
  }

  return (
    <Carousel className={cn('w-full', className)} opts={{ align: 'start', loop: slides.length > 1 }}>
      <CarouselContent className="ml-0">
        {slides.map((slide, index) => (
          <CarouselItem key={slide.id} className="lg:basis-1/2">
            <article className="space-y-3">
              <MediaFrame
                alt={slide.image.alt || slide.albumTitle || `Фото ${index + 1}`}
                aspectClassName="aspect-[16/10] sm:aspect-[4/3] lg:aspect-[16/9]"
                priority={index === 0}
                resource={slide.image}
              />

              <div className="flex items-center justify-between gap-3">
                <Badge variant="neutral">{slide.albumTitle || 'Галерея'}</Badge>
                <span className="text-xs uppercase tracking-[0.2em] text-foreground/50">
                  {index + 1}/{slides.length}
                </span>
              </div>
            </article>
          </CarouselItem>
        ))}
      </CarouselContent>

      {slides.length > 1 ? (
        <>
          <CarouselPrevious className="hidden lg:inline-flex" />
          <CarouselNext className="hidden lg:inline-flex" />
        </>
      ) : null}
    </Carousel>
  )
}
