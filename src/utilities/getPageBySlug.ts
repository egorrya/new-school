import configPromise from '@payload-config'
import type { Page as PageDocument } from '@/payload-types'
import { draftMode } from 'next/headers'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import { cache } from 'react'

async function getPageBySlug(slug: string, draft: boolean) {
  try {
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'pages',
      draft,
      depth: 2,
      limit: 1,
      pagination: false,
      overrideAccess: draft,
      where: {
        slug: {
          equals: slug,
        },
      },
    })

    return (result.docs?.[0] as PageDocument | undefined) || null
  } catch {
    return null
  }
}

const getCachedPublishedPageBySlug = (slug: string) =>
  unstable_cache(() => getPageBySlug(slug, false), ['page', slug], {
    tags: [`page_${slug}`],
  })

export const queryPageBySlug = cache(async (slug: string) => {
  const { isEnabled: draft } = await draftMode()

  return draft ? getPageBySlug(slug, true) : getCachedPublishedPageBySlug(slug)()
})
