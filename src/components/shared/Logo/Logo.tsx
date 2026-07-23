import clsx from 'clsx'
import type { Media } from '@/payload-types'
import { ImageMedia } from '@/components/shared/Media/ImageMedia'
import React, { type CSSProperties } from 'react'

interface Props {
  className?: string
  compactLogo?: Media | number | null
  logoType?: 'text' | 'image' | null
  logo?: Media | number | null
  siteName?: string | null
  sizeVariant?: 'default' | 'header'
  state?: 'expanded' | 'compact'
}

type LogoStyle = CSSProperties & {
  '--logo-compact-ratio'?: string
  '--logo-expanded-ratio'?: string
}

const getImageRatio = (image: Media | null) => {
  if (!image?.width || !image.height || image.height <= 0) {
    return 1
  }

  return image.width / image.height
}

export const Logo = (props: Props) => {
  const { className, compactLogo, logo, logoType, siteName, sizeVariant = 'default', state = 'expanded' } = props
  const title = siteName || 'Новая школа'
  const logoImage = typeof logo === 'object' ? logo : null
  const compactLogoImage = typeof compactLogo === 'object' ? compactLogo : null
  const primaryLogoImage = logoImage ?? compactLogoImage
  const useImageLogo = logoType === 'image'
  const isHeaderVariant = sizeVariant === 'header'
  const baseImageClassName = isHeaderVariant
    ? 'h-full max-h-full w-auto object-contain'
    : 'h-12 w-auto object-contain sm:h-14'
  const compactImageClassName = isHeaderVariant
    ? 'h-full max-h-full w-auto object-contain'
    : 'h-9 w-auto object-contain sm:h-10'
  const expandedTextClassName = isHeaderVariant ? 'text-lg sm:text-xl' : 'text-lg sm:text-xl'

  if (useImageLogo && primaryLogoImage?.url) {
    const hasCompactLogo = Boolean(logoImage?.url && compactLogoImage?.url && compactLogoImage.id !== logoImage.id)
    const logoStyle: LogoStyle | undefined = isHeaderVariant
      ? {
          '--logo-expanded-ratio': getImageRatio(primaryLogoImage).toString(),
          '--logo-compact-ratio': getImageRatio(hasCompactLogo ? compactLogoImage : primaryLogoImage).toString(),
        }
      : undefined
    const compactLogoSize = isHeaderVariant && compactLogoImage?.width
      ? `${compactLogoImage.width}px`
      : isHeaderVariant
        ? '807px'
        : '320px'

    return (
      <span
        className={clsx(
          'group relative inline-flex origin-center items-center text-foreground',
          isHeaderVariant
            ? 'h-full overflow-hidden transition-[width,transform] duration-[560ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[width,transform] w-[calc(var(--site-header-logo-height)*var(--logo-expanded-ratio))] data-[logo-state=expanded]:w-[calc(var(--site-header-logo-height-expanded)*var(--logo-expanded-ratio))] data-[logo-state=compact]:w-[calc(var(--site-header-logo-height)*var(--logo-compact-ratio))]'
            : 'transition-transform duration-300 ease-out',
          className,
        )}
        data-logo-state={isHeaderVariant || hasCompactLogo ? state : undefined}
        style={logoStyle}
      >
        <span
          className={clsx(
            'inline-flex items-center transition-[opacity,transform] duration-[560ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
            isHeaderVariant && 'absolute inset-0 h-full w-full justify-center will-change-[opacity,transform]',
            hasCompactLogo &&
              'group-data-[logo-state=compact]:pointer-events-none group-data-[logo-state=compact]:scale-[0.97] group-data-[logo-state=compact]:opacity-0',
          )}
        >
          <ImageMedia
            alt={title}
            imgClassName={baseImageClassName}
            pictureClassName={isHeaderVariant ? 'block h-full' : 'block'}
            priority
            resource={primaryLogoImage}
            size="192px"
          />
        </span>
        {hasCompactLogo ? (
          <span
            aria-hidden="true"
            className={clsx(
              'pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-[opacity,transform] duration-[560ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity,transform]',
              isHeaderVariant
                ? 'h-full w-full scale-[1.03]'
                : 'translate-y-1 scale-95',
              'group-data-[logo-state=compact]:translate-y-0 group-data-[logo-state=compact]:scale-100 group-data-[logo-state=compact]:opacity-100',
            )}
          >
            <ImageMedia
              alt=""
              imgClassName={compactImageClassName}
              pictureClassName={isHeaderVariant ? 'block h-full' : 'block'}
              priority={isHeaderVariant}
              resource={compactLogoImage}
              size={compactLogoSize}
            />
          </span>
        ) : null}
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
      <span className={clsx('font-heading leading-none tracking-[0.01em]', expandedTextClassName)}>{title}</span>
    </span>
  )
}
