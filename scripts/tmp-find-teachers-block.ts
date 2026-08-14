import 'dotenv/config'

import { getPayload } from 'payload'

import config from '@payload-config'

async function main() {
  const payload = await getPayload({ config })

  try {
    const pages = await payload.find({
      collection: 'pages',
      limit: 200,
      depth: 0,
    })

    for (const page of pages.docs) {
      const layout = (page as any).layout as Array<Record<string, unknown>> | undefined
      if (!layout) continue
      layout.forEach((block, index) => {
        if (block.blockType === 'textImage' && typeof block.title === 'string' && block.title.includes('Педагог')) {
          console.log('PAGE:', page.slug, 'id:', page.id, 'blockIndex:', index)
          console.log(JSON.stringify(block, null, 2))
        }
      })
    }
  } finally {
    await payload.destroy()
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
