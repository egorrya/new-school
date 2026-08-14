import 'dotenv/config'

import { getPayload } from 'payload'

import config from '@payload-config'

async function main() {
  const payload = await getPayload({ config })

  try {
    const result = await payload.find({
      collection: 'teachers',
      depth: 0,
      limit: 10,
      pagination: false,
      sort: 'sortOrder',
      where: {
        photo: {
          exists: true,
        },
      },
    })

    console.log('totalDocs (with photo):', result.totalDocs)
    result.docs.forEach((t) => console.log(t.id, t.name, t.photo))
  } finally {
    await payload.destroy()
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
