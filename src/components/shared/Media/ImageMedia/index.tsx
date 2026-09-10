'use client'

import type { StaticImageData } from 'next/image'

import { cn } from '@/utilities/ui'
import NextImage from 'next/image'
import React, { useLayoutEffect, useRef, useState } from 'react'

import type { Props as MediaProps } from '../types'

import { cssVariables } from '@/utilities/cssVariables'
import { getMediaUrl } from '@/utilities/getMediaUrl'

const { breakpoints } = cssVariables

// Transparent SVG placeholder so images don't flash black while loading.
const placeholderBlur =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxIDEiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMCIvPjwvc3ZnPg=='

/**
 * ImageMedia
 *
 * This component passes a **relative** `src` (e.g. `/media/...`) to Next.js Image.
 * The `getMediaUrl` utility constructs the full URL by prepending the base URL from env vars
 * (NEXT_PUBLIC_SERVER_URL). Next.js then optimizes this using `remotePatterns` configured
 * in next.config.js — no custom `loader` needed.
 *
 * Flow:
 *   1. Resource URL from Payload: `/media/image-123.jpg`
 *   2. getMediaUrl() adds base URL: `https://yourdomain.com/media/image-123.jpg`
 *   3. Next.js Image optimizes via remotePatterns: `/_next/image?url=...&w=1200&q=75`
 *
 * If your storage/plugin returns **external CDN URLs** (e.g. `https://cdn.example.com/...`),
 * choose ONE of the following:
 *   A) Allow the remote host in next.config.js:
 *      images: { remotePatterns: [{ protocol: 'https', hostname: 'cdn.example.com' }] }
 *   B) Provide a **custom loader** for CDN-specific transforms:
 *      const imageLoader: ImageLoader = ({ src, width, quality }) =>
 *        `https://cdn.example.com${src}?w=${width}&q=${quality ?? 75}`
 *      <Image loader={imageLoader} src="/media/hero.jpg" width={1200} height={600} alt="" />
 *   C) Skip optimization:
 *      <Image unoptimized src="https://cdn.example.com/hero.jpg" width={1200} height={600} alt="" />
 *
 * TL;DR: Use relative URLs + getMediaUrl() to construct full URLs, then rely on
 * remotePatterns for optimization. Only add `loader` if using external CDNs with custom transforms.
 */

export const ImageMedia: React.FC<MediaProps> = (props) => {
  const {
    alt: altFromProps,
    disableFadeIn,
    fill,
    pictureClassName,
    imgClassName,
    imgStyle,
    priority,
    quality = 75,
    reveal = 'fade',
    resource,
    size: sizeFromProps,
    src: srcFromProps,
    loading: loadingFromProps,
    onLoad,
  } = props

  const imgRef = useRef<HTMLImageElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [skipTransition, setSkipTransition] = useState(false)

  // If a fresh <img> mounts (e.g. a shared layoutId photo that morphs from a
  // grid card into a modal) but the browser already has this exact image
  // cached, skip the fade-in — otherwise it visibly flashes to transparent
  // and back even though nothing actually needs to load.
  useLayoutEffect(() => {
    const img = imgRef.current
    if (img?.complete && img.naturalWidth > 0) {
      setSkipTransition(true)
      setIsLoaded(true)
    }
  }, [])

  let width: number | undefined
  let height: number | undefined
  let alt = altFromProps
  let src: StaticImageData | string = srcFromProps || ''

  if (!src && resource && typeof resource === 'object') {
    const { alt: altFromResource, height: fullHeight, url, width: fullWidth } = resource

    width = fullWidth!
    height = fullHeight!
    alt = altFromResource || altFromProps || ''

    const cacheTag = resource.updatedAt

    src = getMediaUrl(url, cacheTag)
  }

  const loading = priority ? undefined : loadingFromProps || 'lazy'

  // NOTE: this is used by the browser to determine which image to download at different screen sizes
  const sizes = sizeFromProps
    ? sizeFromProps
    : Object.entries(breakpoints)
        .map(([, value]) => `(max-width: ${value}px) ${value * 2}w`)
        .join(', ')

  return (
    <picture
      className={cn(
        pictureClassName,
        !disableFadeIn &&
          !skipTransition &&
          'motion-safe:transition-[filter,opacity,transform] motion-safe:duration-700 motion-safe:ease-out',
        disableFadeIn || isLoaded ? 'opacity-100' : 'opacity-0',
        !disableFadeIn &&
          !skipTransition &&
          reveal === 'soft' &&
          (isLoaded
            ? 'motion-safe:scale-100 motion-safe:blur-0'
            : 'motion-safe:scale-[1.015] motion-safe:blur-[2px]'),
      )}
    >
      <NextImage
        ref={imgRef}
        alt={alt || ''}
        className={cn(imgClassName)}
        fill={fill}
        height={!fill ? height : undefined}
        style={imgStyle}
        placeholder="blur"
        blurDataURL={placeholderBlur}
        priority={priority}
        quality={quality}
        loading={loading}
        onLoad={(event) => {
          const markLoaded = () => {
            setIsLoaded(true)
            onLoad?.()
          }

          // Decode off the main thread first so the reveal animation doesn't
          // stutter on the same frame as a synchronous decode of a large image.
          const img = event.currentTarget
          if (img.decode) {
            img.decode().then(markLoaded).catch(markLoaded)
          } else {
            markLoaded()
          }
        }}
        sizes={sizes}
        src={src}
        width={!fill ? width : undefined}
      />
    </picture>
  )
}
