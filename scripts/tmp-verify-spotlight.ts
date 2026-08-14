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
    })

    const layout = (page as any).layout as Array<Record<string, unknown>>
    const block = layout.find((b) => b.id === '6a7e60a1c476359d83ea9afb')
    console.log(JSON.stringify(block, null, 2))
  } finally {
    await payload.destroy()
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
