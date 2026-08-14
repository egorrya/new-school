import 'dotenv/config'

import { getPayload } from 'payload'

import config from '@payload-config'

const PAGE_ID = 8
const BLOCK_ID = '6a7e60a1c476359d83ea9afb'

async function main() {
  console.log('connecting...')
  const payload = await getPayload({ config })
  console.log('connected')

  try {
    console.log('finding page...')
    const page = await payload.findByID({
      collection: 'pages',
      id: PAGE_ID,
      depth: 0,
    })
    console.log('found page:', page?.id, page?.slug)

    if (!page) {
      console.log('Page not found:', PAGE_ID)
      return
    }

    const layout = (page as any).layout as Array<Record<string, unknown>>
    const blockIndex = layout.findIndex((block) => block.id === BLOCK_ID)

    if (blockIndex === -1) {
      console.log('Block not found:', BLOCK_ID)
      return
    }

    layout[blockIndex] = {
      ...layout[blockIndex],
      teacherPhotosInstallation: true,
    }

    console.log('updating page...')
    await payload.update({
      collection: 'pages',
      id: page.id,
      data: { layout },
      depth: 0,
      context: { disableRevalidate: true },
    })

    console.log('Updated block', BLOCK_ID, 'on page', page.slug)
  } finally {
    await payload.destroy()
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
