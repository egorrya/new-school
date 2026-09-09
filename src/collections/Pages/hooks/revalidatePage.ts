import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Page } from '../../../payload-types'

function revalidatePublishedPage(slug: string) {
  const path = slug === 'home' ? '/' : `/${slug}`

  revalidatePath(path)
  revalidateTag(`page_${slug}`, 'max')
  revalidateTag('pages-sitemap', 'max')
}

export const revalidatePage: CollectionAfterChangeHook<Page> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const publishedSlugs = new Set(
      [
        doc._status === 'published' ? doc.slug : undefined,
        previousDoc?._status === 'published' ? previousDoc.slug : undefined,
      ].filter((slug): slug is string => Boolean(slug)),
    )

    for (const slug of publishedSlugs) {
      const path = slug === 'home' ? '/' : `/${slug}`

      payload.logger.info(`Revalidating page at path: ${path}`)
      revalidatePublishedPage(slug)
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Page> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate && doc?.slug) {
    revalidatePublishedPage(doc.slug)
  }

  return doc
}
