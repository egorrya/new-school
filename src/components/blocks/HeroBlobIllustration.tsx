'use client'

import Image from 'next/image'
import { type CSSProperties, type ReactNode, useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

import type { HeroBlock as HeroBlockType } from '@/payload-types'

import blobFallback from '../../../public/hero/blob.webp'
import kidsFallback from '../../../public/hero/kids.webp'

import { ImageMedia } from '@/components/shared/Media/ImageMedia'
import { cn } from '@/utilities/ui'
import { useIsMobileViewport } from '@/utilities/useIsMobileViewport'

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

function OrnamentImage({ src, loading = 'lazy' }: { src: string; loading?: 'eager' | 'lazy' }) {
  return (
    <Image
      alt=""
      aria-hidden="true"
      className="object-contain"
      decoding="async"
      fill
      loading={loading}
      sizes="12rem"
      src={src}
      unoptimized
    />
  )
}

type HeroRevealProps = {
  children: ReactNode
  className?: string
  delay: number
  shouldReduceMotion: boolean
}

function HeroReveal({ children, className, delay, shouldReduceMotion }: HeroRevealProps) {
  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12, scale: 0.985, filter: 'blur(2px)' }}
      transition={{
        delay,
        duration: 0.72,
        ease: 'easeOut',
      }}
      viewport={{ amount: 0.15, once: true }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
    >
      {children}
    </motion.div>
  )
}

export function HeroBlobIllustration({
  blobImage,
  kidsImage,
  showBlobBackground = true,
  customBlobPositioning = true,
}: HeroBlobIllustrationProps) {
  const shouldReduceMotion = useReducedMotion() ?? false
  const isMobile = useIsMobileViewport()
  const shouldReduceContinuousMotion = shouldReduceMotion || isMobile
  const [showBookoraa, setShowBookoraa] = useState(false)
  const [showWiggleLine, setShowWiggleLine] = useState(false)
  const [showStars, setShowStars] = useState(false)
  const blobResource = toMediaResource(blobImage)
  const hasCustomBlobImage = Boolean(blobResource?.url)
  const kidsResource = toMediaResource(kidsImage)

  useEffect(() => {
    const bookoraaTimer = window.setTimeout(() => {
      setShowBookoraa(true)
    }, shouldReduceMotion ? 0 : 1500)

    const wiggleTimer = window.setTimeout(() => {
      setShowWiggleLine(true)
    }, shouldReduceMotion ? 0 : 2500)

    const starsTimer = window.setTimeout(() => {
      setShowStars(true)
    }, shouldReduceMotion ? 0 : 4000)

    return () => {
      window.clearTimeout(bookoraaTimer)
      window.clearTimeout(wiggleTimer)
      window.clearTimeout(starsTimer)
    }
  }, [shouldReduceMotion])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative isolate aspect-1448/1086 w-full max-w-none overflow-visible"
    >
      <div className="absolute inset-0 z-20 overflow-visible">
        {showBookoraa ? (
          <HeroReveal
            className="absolute bottom-[-24%] left-[-10%] h-[clamp(7rem,16vw,12rem)] w-[clamp(9.5rem,20vw,16rem)] origin-center"
            delay={0.3}
            shouldReduceMotion={shouldReduceMotion}
          >
            <div className="relative h-full w-full">
              <OrnamentImage loading="eager" src="/hero/ornaments/Bookoraa.svg" />
            </div>
          </HeroReveal>
        ) : null}

        <HeroReveal
          className="absolute right-[-9%] bottom-[-16%] h-[clamp(5.25rem,11vw,8.5rem)] w-[clamp(11rem,17vw,18.5rem)] origin-center"
          delay={2.25}
          shouldReduceMotion={shouldReduceMotion}
        >
          <motion.div
            className="relative h-full w-full"
            initial={shouldReduceContinuousMotion ? false : { x: 0, rotate: 25 }}
            animate={
              shouldReduceContinuousMotion
                ? undefined
                : {
                    x: [0, 9, 0, -9, 0],
                    y: [0, -2, 0, 2, 0],
                    rotate: [25, 27.5, 25, 22.5, 25],
                  }
            }
            transition={
              shouldReduceContinuousMotion
                ? undefined
                : {
                    duration: 5.8,
                    ease: 'easeInOut',
                    repeat: Infinity,
                    repeatType: 'loop',
                  }
            }
            style={{ willChange: 'transform' }}
          >
            <div className="absolute inset-0">
              <Image
                alt=""
                aria-hidden="true"
                fill
                sizes="100vw"
                src="/hero/puzzle.webp"
                className="object-contain"
                loading="lazy"
                unoptimized
              />
            </div>
          </motion.div>
        </HeroReveal>

        {showWiggleLine ? (
          <div className="absolute right-[-2%] top-[-1%] sm:top-[0%] h-[clamp(3rem,6vw,4.5rem)] w-[clamp(7rem,12vw,10rem)] rotate-25 origin-center">
            <div className="relative h-full w-full">
              <OrnamentImage loading="eager" src="/hero/ornaments/wiggle-line.svg" />
            </div>
          </div>
        ) : null}
      </div>

      {showStars ? (
        <HeroReveal
          className="absolute left-[-13%] top-[-16%] z-[-1] h-[clamp(12.75rem,22.5vw,18.75rem)] w-[clamp(12.75rem,22.5vw,18.75rem)] origin-center"
          delay={0.36}
          shouldReduceMotion={shouldReduceMotion}
        >
          <div className="relative h-full w-full">
            <OrnamentImage loading="eager" src="/hero/ornaments/stars.svg" />
          </div>
        </HeroReveal>
      ) : null}

      {showBlobBackground ? (
        <HeroReveal
          className={cn(
            'absolute z-0',
            customBlobPositioning
              ? 'left-[-18%] top-0 right-[-10%] bottom-[-9%] scale-x-[0.91] scale-y-[0.72] origin-center'
              : 'inset-0',
          )}
          delay={1.2}
          shouldReduceMotion={shouldReduceMotion}
        >
          {shouldReduceContinuousMotion ? (
            <div className="absolute inset-0">
              <ImageMedia
                alt=""
                fill
                imgClassName="object-contain opacity-100"
                pictureClassName="absolute inset-0"
                priority
                resource={hasCustomBlobImage ? blobResource : undefined}
                src={hasCustomBlobImage ? undefined : blobFallback}
              />
            </div>
          ) : (
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{
                duration: 10.4,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'loop',
              }}
              style={{ willChange: 'transform' }}
            >
              <ImageMedia
                alt=""
                fill
                imgClassName="object-contain opacity-100"
                pictureClassName="absolute inset-0"
                priority
                resource={hasCustomBlobImage ? blobResource : undefined}
                src={hasCustomBlobImage ? undefined : blobFallback}
              />
            </motion.div>
          )}
        </HeroReveal>
      ) : null}
      <div className="absolute inset-0 z-10">
        <HeroReveal className="absolute inset-0" delay={0.85} shouldReduceMotion={shouldReduceMotion}>
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
        </HeroReveal>
      </div>
    </div>
  )
}
