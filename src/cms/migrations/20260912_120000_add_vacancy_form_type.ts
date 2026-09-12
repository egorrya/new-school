import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TYPE "enum_form_submissions_form_type" ADD VALUE IF NOT EXISTS 'vacancy';
  `)
}

export async function down(_: MigrateDownArgs): Promise<void> {}
