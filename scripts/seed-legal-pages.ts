import 'dotenv/config'

import { getPayload } from 'payload'

import config from '@payload-config'
import { legalDocumentPages } from './legal-document-pages'

async function main() {
  const payload = await getPayload({ config })

  try {
    for (const page of legalDocumentPages) {
      const existing = await payload.find({
        collection: 'pages',
        depth: 0,
        limit: 1,
        overrideAccess: true,
        pagination: false,
        where: {
          slug: {
            equals: page.slug,
          },
        },
      })

      const data = {
        ...page,
        generateSlug: false,
        _status: 'published' as const,
      }

      if (existing.docs[0]) {
        await payload.update({
          collection: 'pages',
          context: { disableRevalidate: true },
          data: data as never,
          draft: false,
          id: existing.docs[0].id,
          overrideAccess: true,
        })
      } else {
        await payload.create({
          collection: 'pages',
          context: { disableRevalidate: true },
          data: data as never,
          draft: false,
          overrideAccess: true,
        })
      }
    }

    console.log('Legal pages seeded successfully.')
  } finally {
    await payload.destroy()
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
