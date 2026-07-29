import 'dotenv/config'

import { getPayload } from 'payload'

import config from '@payload-config'

const updates: Record<string, string> = {
  kruzhki:
    'Кулинария, рукоделие, изобразительное искусство, музыкально-театральная студия и каллиграфия для детей.',
  anglijskij: 'Английский для всех возрастов: от дошкольников до взрослых, с подготовкой к ОГЭ и ЕГЭ.',
}

async function main() {
  const payload = await getPayload({ config })

  try {
    const all = await payload.find({
      collection: 'programCategories',
      limit: 100,
      pagination: false,
    })

    console.log('Existing categories:')
    for (const doc of all.docs) {
      console.log(`- ${doc.slug}: "${doc.title}" desc len=${(doc.description ?? '').length}`)
    }

    for (const [slug, description] of Object.entries(updates)) {
      const found = await payload.find({
        collection: 'programCategories',
        limit: 1,
        where: { slug: { equals: slug } },
      })

      const doc = found.docs[0]
      if (!doc) {
        console.log(`Skipping ${slug}: not found`)
        continue
      }

      await payload.update({
        id: doc.id,
        collection: 'programCategories',
        data: { description },
      })
      console.log(`Updated ${slug}`)
    }

    console.log('Done.')
  } finally {
    await payload.destroy()
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
