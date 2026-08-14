import 'dotenv/config'

import { getPayload } from 'payload'

import config from '@payload-config'

const PAGE_ID = 8
const BLOCK_ID = '6a7e60a1c476359d83ea9afb'

async function main() {
  const payload = await getPayload({ config })

  try {
    const page = await payload.findByID({
      collection: 'pages',
      id: PAGE_ID,
      depth: 0,
    })

    const layout = (page as any).layout as Array<Record<string, unknown>>
    const blockIndex = layout.findIndex((block) => block.id === BLOCK_ID)

    if (blockIndex === -1) {
      console.log('Block not found:', BLOCK_ID)
      return
    }

    const oldBlock = layout[blockIndex]

    layout[blockIndex] = {
      id: oldBlock.id,
      blockType: 'teacherSpotlight',
      eyebrow: oldBlock.eyebrow ?? null,
      title: oldBlock.title,
      text: oldBlock.text ?? null,
      items: oldBlock.items ?? [],
      closingText: oldBlock.closingText ?? null,
      buttonLabel: oldBlock.buttonLabel ?? null,
      buttonLink: oldBlock.buttonLink ?? null,
      imagePosition: oldBlock.imagePosition ?? 'right',
    }

    await payload.update({
      collection: 'pages',
      id: page.id,
      data: { layout },
      depth: 0,
      context: { disableRevalidate: true },
    })

    console.log('Migrated block', BLOCK_ID, 'on page', page.slug, 'to teacherSpotlight')
  } finally {
    await payload.destroy()
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
