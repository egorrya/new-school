import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "form_submissions"
      SET "form_type" = 'vacancy'
      WHERE "job_id" IS NOT NULL AND "form_type" = 'application';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "form_submissions"
      SET "form_type" = 'application'
      WHERE "form_type" = 'vacancy';
  `)
}
