import clsx from 'clsx'
import type { Media } from '@/payload-types'
import { ImageMedia } from '@/components/shared/Media/ImageMedia'
import React from 'react'

interface Props {
  className?: string
  logoType?: 'text' | 'image' | null
  logo?: Media | number | null
  siteName?: string | null
}

export const Logo = (props: Props) => {
  const { className, logo, siteName } = props
  const title = siteName || 'Новая школа'
  const logoImage = typeof logo === 'object' ? logo : null

  if (logoImage?.url) {
    return (
      <span className={clsx('inline-flex items-center text-foreground', className)}>
        <ImageMedia
          alt={title}
          imgClassName="h-12 w-auto object-contain sm:h-14"
          pictureClassName="block"
          priority
          resource={logoImage}
          size="192px"
        />
      </span>
    )
  }

  return (
    <span
      className={clsx(
        'inline-flex max-w-full items-center overflow-hidden text-ellipsis whitespace-nowrap text-foreground',
        className,
      )}
    >
      <span className="font-heading text-lg leading-none tracking-[0.01em] sm:text-xl">{title}</span>
    </span>
  )
}
