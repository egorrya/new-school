import type { Media, Review } from '@/payload-types'

import { getMediaUrl } from '@/utilities/getMediaUrl'

export type TestimonialItem = {
  id: string
  quote: string
  author: string
  role: string
  avatarUrl?: string | null
}

export function getTestimonialQuoteClass(quote: string) {
  const wordCount = quote.trim().split(/\s+/).filter(Boolean).length

  if (wordCount > 24) {
    return 'font-base text-base leading-relaxed sm:text-lg lg:text-xl'
  }

  if (wordCount > 12) {
    return 'font-heading text-xl leading-[1.25] sm:text-2xl lg:text-3xl'
  }

  return 'font-heading text-2xl leading-[1.18] sm:text-3xl lg:text-4xl'
}

function isMediaDocument(resource: number | Media | null | undefined): resource is Media {
  return typeof resource === 'object' && resource !== null
}

function getAvatarUrl(review: Review) {
  if (!isMediaDocument(review.avatar)) {
    return null
  }

  const avatar = review.avatar
  const url = avatar.sizes?.thumbnail?.url || avatar.sizes?.square?.url || avatar.url

  return getMediaUrl(url, avatar.updatedAt)
}

export function toTestimonialItems(reviews: Review[]): TestimonialItem[] {
  return reviews.map((review) => ({
    id: String(review.id),
    quote: review.text,
    author: review.authorName,
    role: review.authorDescription || 'Автор отзыва',
    avatarUrl: getAvatarUrl(review),
  }))
}
