import type { Media as MediaType } from '@/payload-types'
import Image from 'next/image'
import * as React from 'react'

import { Media } from '@/components/shared/Media'

import { cn } from '@/utilities/ui'

type MediaFrameProps = {
  alt?: string
  children?: React.ReactNode
  className?: string
  imageClassName?: string
  priority?: boolean
  resource?: MediaType | number | null
  aspectClassName?: string
  fallbackImageSrc?: string
}

export function MediaFrame({
  alt = 'Изображение',
  children,
  className,
  imageClassName,
  priority,
  resource,
  aspectClassName = 'aspect-[4/3]',
  fallbackImageSrc,
}: MediaFrameProps) {
  const mediaResource = typeof resource === 'object' ? resource : null
  const hasMedia = Boolean(mediaResource)

  return (
    <div
      className={cn(
        'relative w-full min-w-0 overflow-hidden rounded-base bg-secondary-background shadow-shadow',
        aspectClassName,
        className,
      )}
    >
      {hasMedia ? (
        <Media
          alt={alt}
          fill
          htmlElement={null}
          pictureClassName="relative block h-full w-full"
          imgClassName={cn('h-full w-full object-cover', imageClassName)}
          priority={priority}
          resource={mediaResource}
          videoClassName={cn('absolute inset-0 h-full w-full object-cover', imageClassName)}
        />
      ) : fallbackImageSrc ? (
        <Image
          alt={alt}
          className={cn('object-cover', imageClassName)}
          fill
          sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
          src={fallbackImageSrc}
          unoptimized
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
          <div className="max-w-sm">
            <p className="font-heading text-lg leading-tight">Изображение пока не добавлено</p>
            <p className="mt-2 text-sm leading-relaxed text-foreground/70">
              Добавьте медиафайл в Payload, чтобы этот блок стал визуально выразительнее.
            </p>
          </div>
        </div>
      )}

      {children}
    </div>
  )
}
