import 'dotenv/config'

import { getPayload } from 'payload'

import config from '@payload-config'

async function main() {
  const payload = await getPayload({ config })

  try {
    const page = await payload.findByID({
      collection: 'pages',
      id: 8,
      depth: 0,
      overrideAccess: true,
    })

    console.log('id:', page.id)
    console.log('slug:', page.slug)
    console.log('_status:', (page as any)._status)
  } finally {
    await payload.destroy()
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
