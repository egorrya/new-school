import 'dotenv/config'

import { getPayload } from 'payload'

import config from '@payload-config'

async function main() {
  const payload = await getPayload({ config })

  try {
    const found = await payload.find({
      collection: 'programCategories',
      limit: 1,
      where: { slug: { equals: 'family-classes' } },
    })

    const doc = found.docs[0]
    if (!doc) {
      console.log('Not found: family-classes')
      return
    }

    console.log(`Title: ${doc.title}`)
    console.log(`Current description (len=${(doc.description ?? '').length}):`)
    console.log(doc.description)
  } finally {
    await payload.destroy()
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
