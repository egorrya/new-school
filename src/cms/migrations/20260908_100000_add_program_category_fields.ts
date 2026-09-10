import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "program_categories"
      ADD COLUMN IF NOT EXISTS "page_title" varchar,
      ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "sort_order" numeric DEFAULT 0;

    UPDATE "program_categories"
      SET "is_active" = true
      WHERE "is_active" IS NULL;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "program_categories"
      DROP COLUMN IF EXISTS "sort_order",
      DROP COLUMN IF EXISTS "is_active",
      DROP COLUMN IF EXISTS "page_title";
  `)
}
