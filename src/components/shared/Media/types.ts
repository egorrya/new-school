import type { StaticImageData } from 'next/image'
import type { CSSProperties, ElementType, Ref } from 'react'

import type { Media as MediaType } from '@/payload-types'

export interface Props {
  alt?: string
  className?: string
  // Skip ImageMedia's own opacity fade-in (for NextImage only). Useful when
  // a parent is already animating this element itself (e.g. a Motion
  // layoutId crossfade) and a second, independently-timed fade underneath
  // would just fight it.
  disableFadeIn?: boolean
  fill?: boolean // for NextImage only
  htmlElement?: ElementType | null
  pictureClassName?: string
  imgClassName?: string
  imgStyle?: CSSProperties
  onClick?: () => void
  onLoad?: () => void
  loading?: 'lazy' | 'eager' // for NextImage only
  priority?: boolean // for NextImage only
  quality?: number // for NextImage only
  // `soft` adds a subtle scale and blur transition alongside the standard fade-in.
  reveal?: 'fade' | 'soft'
  ref?: Ref<HTMLImageElement | HTMLVideoElement | null>
  resource?: MediaType | string | number | null // for Payload media
  size?: string // for NextImage only
  src?: StaticImageData // for static media
  videoClassName?: string
}
