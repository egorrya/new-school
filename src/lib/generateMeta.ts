import type { Metadata } from 'next/types'

import type { Config, Media } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from '../utilities/getURL'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/og-image.svg'

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url

    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return url
}

type MetaDoc = {
  meta?: {
    description?: string | null
    image?: Media | Config['db']['defaultIDType'] | null
    title?: string | null
  } | null
  pageTitle?: string | null
  slug?: string | null
  title?: string | null
}

export const generateMeta = async (args: {
  doc: MetaDoc | null
}): Promise<Metadata> => {
  const { doc } = args

  const ogImage = getImageURL(doc?.meta?.image)

  const title = doc?.meta?.title
    ? `${doc?.meta?.title} | Новая школа`
    : doc?.pageTitle
      ? `${doc?.pageTitle} | Новая школа`
      : doc?.title
        ? `${doc?.title} | Новая школа`
        : 'Новая школа'

  return {
    description: doc?.meta?.description,
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || '',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: doc?.slug ? (doc.slug === 'home' ? '/' : `/${doc.slug}`) : '/',
    }),
    title,
  }
}
