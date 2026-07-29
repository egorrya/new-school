import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { Plugin } from 'payload'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { getDocumentHref } from '@/utilities/getDocumentHref'
import { getServerSideURL } from '@/utilities/getURL'

type SluggableDoc = {
  name?: string | null
  pageTitle?: string | null
  slug?: string | null
  title?: string | null
}

const generateTitle: GenerateTitle<SluggableDoc> = ({ doc }) => {
  const title = doc?.pageTitle || doc?.title || doc?.name

  return title ? `${title} | Новая школа` : 'Новая школа'
}

const generateURL: GenerateURL<SluggableDoc> = ({ doc, collectionSlug }) => {
  const url = getServerSideURL()

  if (!doc?.slug) {
    return url
  }

  const path = getDocumentHref(collectionSlug ?? 'pages', doc.slug)

  return `${url}${path}`
}

export const plugins: Plugin[] = [
  redirectsPlugin({
    collections: ['pages', 'news', 'clubs'],
    overrides: {
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'При изменении этого поля потребуется пересобрать сайт.',
              },
            }
          }

          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  vercelBlobStorage({
    collections: {
      media: true,
    },
    token: process.env.BLOB_READ_WRITE_TOKEN,
  }),
]
