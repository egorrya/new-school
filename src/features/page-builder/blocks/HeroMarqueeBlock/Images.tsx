import Image from 'next/image'

import type { Media as MediaType } from '@/payload-types'

import { cn } from '@/shared/lib/cn'
import { getMediaUrl } from '@/shared/lib/getMediaUrl'

type HeroMarqueeImagesProps = {
  images: MediaType[]
  className?: string
}

const photoSize = '(max-width: 640px) 132px, (max-width: 1024px) 196px, 264px'

/**
 * A CSS-only loop keeps the gallery in the server-rendered HTML. Two identical
 * segments let the existing 50% marquee translation loop seamlessly without
 * measuring layout or hydrating every image on the first screen.
 */
export function HeroMarqueeImages({ images, className }: HeroMarqueeImagesProps) {
  return (
    <div className={cn('overflow-x-hidden py-2 sm:py-3', className)}>
      <div className="hero-photo-marquee flex w-max min-w-full items-stretch gap-1 [--marquee-duration:28s] animate-marquee motion-reduce:animate-none sm:gap-2 sm:[--marquee-duration:36s]">
        {[0, 1].map((copyIndex) => (
          <div
            aria-hidden={copyIndex === 0 ? undefined : true}
            className="flex shrink-0 items-stretch gap-1 sm:gap-2"
            key={copyIndex}
          >
            {images.map((image, index) => {
              if (!image.url || !image.width || !image.height) {
                return null
              }

              const isLcpImage = copyIndex === 0 && index === 0
              const isAboveTheFold = copyIndex === 0 && index < 2
              const revealDelay = Math.min(index, 8) * 80

              return (
                <div
                  className="hero-marquee-image-reveal h-44 shrink-0 overflow-hidden rounded-base shadow-shadow sm:h-56 lg:h-72"
                  key={`${copyIndex}-${image.id}-${index}`}
                  style={{ animationDelay: `${revealDelay}ms` }}
                >
                  <Image
                    alt={image.alt || ''}
                    className="h-full w-auto object-contain"
                    fetchPriority={isLcpImage ? 'high' : undefined}
                    height={image.height}
                    loading={isAboveTheFold ? 'eager' : 'lazy'}
                    quality={75}
                    sizes={photoSize}
                    src={getMediaUrl(image.url, image.updatedAt)}
                    width={image.width}
                  />
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
