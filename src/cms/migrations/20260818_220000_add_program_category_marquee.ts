import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "program_categories"
      ADD COLUMN IF NOT EXISTS "show_program_marquee" boolean DEFAULT false;

    UPDATE "program_categories"
      SET "show_program_marquee" = true
      WHERE "slug" = 'kruzhki';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "program_categories" DROP COLUMN IF EXISTS "show_program_marquee";
  `)
}
