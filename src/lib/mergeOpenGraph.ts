import type { Metadata } from 'next'
import { getServerSideURL } from '../utilities/getURL'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: 'Сайт школы «Новая школа» на Payload CMS.',
  images: [
    {
      url: `${getServerSideURL()}/og-image.svg`,
    },
  ],
  siteName: 'Новая школа',
  title: 'Новая школа',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
