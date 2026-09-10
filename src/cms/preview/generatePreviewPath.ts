import { PreviewSearchParams } from '@/app/(frontend)/next/preview/route'

const collectionPrefixMap = {
  pages: '',
} as const

type Props = {
  collection: keyof typeof collectionPrefixMap
  slug: string
}

export const generatePreviewPath = ({ collection, slug }: Props) => {
  if (slug === undefined || slug === null) {
    return null
  }

  // Encode to support slugs with special characters
  const encodedSlug = encodeURIComponent(slug)
  const previewPath = collection === 'pages' && slug === 'home' ? '/' : `${collectionPrefixMap[collection]}/${encodedSlug}`

  const encodedParams = new URLSearchParams({
    path: previewPath,
    previewSecret: process.env.PREVIEW_SECRET || '',
  } satisfies PreviewSearchParams)

  const url = `/next/preview?${encodedParams.toString()}`

  return url
}
