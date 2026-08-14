import configPromise from '@payload-config'
import type { Page as PageDocument } from '@/payload-types'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import { cache } from 'react'

export const queryPageBySlug = cache(async (slug: string) => {
  try {
    const { isEnabled: draft } = await draftMode()

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
})
