import 'dotenv/config'

import { getPayload } from 'payload'

import config from '@payload-config'

async function main() {
  const payload = await getPayload({ config })

  try {
    const header = await payload.findGlobal({ slug: 'header' })
    console.log('--- HEADER ---')
    console.log(JSON.stringify(header, null, 2))

    const pages = await payload.find({
      collection: 'pages',
      limit: 10,
      where: { slug: { equals: 'home' } },
    })
    console.log('--- HOME PAGE CANDIDATES ---')
    console.log(JSON.stringify(pages.docs.map((d: any) => ({ id: d.id, slug: d.slug, title: d.title })), null, 2))
  } finally {
    await payload.destroy()
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
