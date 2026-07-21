import 'dotenv/config'

import { Client } from 'pg'

const tables = ['pages_blocks_cta_form', '_pages_v_blocks_cta_form'] as const
const legacyFormTypeMap: Record<string, 'application' | 'callback' | 'club'> = {
  about: 'callback',
  'active-holidays': 'application',
  'after-school': 'application',
  clubs: 'application',
  'english-school': 'application',
  'family-classes': 'application',
  home: 'application',
  'school-preparation': 'application',
}

async function main(): Promise<void> {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    console.warn('[normalize:legacy-cta-form-types] DATABASE_URL is not set, skipping.')
    return
  }

  const client = new Client({ connectionString })

  await client.connect()

  try {
    await client.query('begin')

    for (const table of tables) {
      let updatedRows = 0

      for (const [legacyValue, normalizedValue] of Object.entries(legacyFormTypeMap)) {
        const result = await client.query(
          `update "${table}" set form_type = $1 where form_type::text = $2`,
          [normalizedValue, legacyValue],
        )

        updatedRows += result.rowCount ?? 0
      }

      if (updatedRows > 0) {
        console.log(`[normalize:legacy-cta-form-types] Updated ${updatedRows} rows in ${table}.`)
      }
    }

    await client.query('commit')
  } catch (error) {
    await client.query('rollback')
    throw error
  } finally {
    await client.end()
  }
}

main().catch((error) => {
  console.error('[normalize:legacy-cta-form-types] Failed:', error)
  process.exit(1)
})
