'use client'

import Image from 'next/image'
import { useEffect, useState, type CSSProperties } from 'react'

import type { HeroBlock as HeroBlockType } from '@/payload-types'

import blobFallback from '../../../public/media/blob.webp'
import kidsFallback from '../../../public/media/kids.webp'

import { ImageMedia } from '@/components/shared/Media/ImageMedia'
import { cn } from '@/utilities/ui'

type HeroBlobIllustrationProps = {
  blobImage?: HeroBlockType['image']
  kidsImage?: HeroBlockType['kidsImage']
  showBlobBackground?: HeroBlockType['showBlobBackground']
  customBlobPositioning?: HeroBlockType['customBlobPositioning']
}

const kidsImageFadeStyle: CSSProperties = {
  maskImage: 'linear-gradient(to bottom, #000 0%, #000 88%, transparent 94%, transparent 100%)',
  WebkitMaskImage:
    'linear-gradient(to bottom, #000 0%, #000 88%, transparent 94%, transparent 100%)',
}

function toMediaResource(resource?: HeroBlobIllustrationProps['blobImage']) {
  return typeof resource === 'object' && resource !== null ? resource : null
}

export function HeroBlobIllustration({
  blobImage,
  kidsImage,
  showBlobBackground = true,
  customBlobPositioning = true,
}: HeroBlobIllustrationProps) {
  const [squiggleMarkup, setSquiggleMarkup] = useState<string | null>(null)
  const [rightLineMarkup, setRightLineMarkup] = useState<string | null>(null)
  const [dotGridMarkup, setDotGridMarkup] = useState<string | null>(null)
  const blobResource = toMediaResource(blobImage)
  const kidsResource = toMediaResource(kidsImage)

  useEffect(() => {
    const controller = new AbortController()

    const loadOrnament = async (url: string) => {
      try {
        const response = await fetch(url, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`Failed to load ornament: ${response.status}`)
        }

        return await response.text()
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return null
        }

        return null
      }
    }

    Promise.all([
      loadOrnament('/media/hero-ornaments/squiggle.svg'),
      loadOrnament('/media/hero-ornaments/right-line.svg'),
      loadOrnament('/media/hero-ornaments/dot-grid.svg'),
    ]).then(([squiggle, rightLine, dotGrid]) => {
      setSquiggleMarkup(squiggle)
      setRightLineMarkup(rightLine)
      setDotGridMarkup(dotGrid)
    })

    return () => controller.abort()
  }, [])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative isolate aspect-[1448/1086] w-full max-w-none overflow-visible"
    >
      <div className="absolute inset-0 z-[20] overflow-visible">
        <div className="absolute bottom-[-16%] left-[-3%] h-[clamp(3.5rem,8vw,6rem)] w-[clamp(4.75rem,10vw,8rem)] rotate-[25deg] origin-center">
          <div
            className="h-full w-full [&_svg]:block [&_svg]:h-full [&_svg]:w-full"
            dangerouslySetInnerHTML={squiggleMarkup ? { __html: squiggleMarkup } : undefined}
          />
        </div>

        <div className="absolute right-[-9%] bottom-[-19%] h-[clamp(5.25rem,11vw,8.5rem)] w-[clamp(11rem,17vw,18.5rem)] rotate-[25deg] origin-center">
          <div className="relative h-full w-full">
            <div className="absolute inset-0">
              <Image
                alt=""
                aria-hidden="true"
                fill
                sizes="100vw"
                src="/media/puzzle.webp"
                className="object-contain"
                priority
                loading="eager"
                unoptimized
              />
            </div>
          </div>
        </div>

        <div className="absolute right-[-2%] top-[-3%] sm:top-[-2%] h-[clamp(3rem,6vw,4.5rem)] w-[clamp(7rem,12vw,10rem)] rotate-[8deg] origin-center">
          <div
            className="h-full w-full [&_svg]:block [&_svg]:h-full [&_svg]:w-full"
            dangerouslySetInnerHTML={rightLineMarkup ? { __html: rightLineMarkup } : undefined}
          />
        </div>
      </div>

      <div className="absolute left-[-2%] top-[-2%] z-[-1] h-[clamp(4.25rem,7.5vw,6.25rem)] w-[clamp(4.25rem,7.5vw,6.25rem)] origin-center">
        <div
          className="h-full w-full [&_svg]:block [&_svg]:h-full [&_svg]:w-full"
          dangerouslySetInnerHTML={dotGridMarkup ? { __html: dotGridMarkup } : undefined}
        />
      </div>

      {showBlobBackground ? (
        <div
          className={cn(
            'absolute z-0',
            customBlobPositioning
              ? '-left-[18%] top-0 -right-[10%] -bottom-[9%] scale-x-[0.91] scale-y-[0.72] origin-center'
              : 'inset-0',
          )}
        >
          <div className="absolute inset-0">
            <ImageMedia
              alt=""
              fill
              imgClassName="object-contain opacity-100"
              pictureClassName="absolute inset-0"
              priority
              resource={blobResource}
              src={blobResource ? undefined : blobFallback}
            />
          </div>
        </div>
      ) : null}
      <div className="absolute inset-0 z-10">
        <ImageMedia
          alt=""
          fill
          imgClassName="origin-center object-contain scale-[1.08] sm:scale-[1.12]"
          imgStyle={kidsImageFadeStyle}
          pictureClassName="absolute inset-0"
          priority
          resource={kidsResource}
          src={kidsResource ? undefined : kidsFallback}
        />
      </div>
    </div>
  )
}
