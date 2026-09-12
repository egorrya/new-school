import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings"
      ADD COLUMN IF NOT EXISTS "form_notifications_enabled" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "form_notifications_recipients" varchar;

    UPDATE "site_settings"
      SET "form_notifications_enabled" = true
      WHERE "form_notifications_enabled" IS NULL;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings"
      DROP COLUMN IF EXISTS "form_notifications_recipients",
      DROP COLUMN IF EXISTS "form_notifications_enabled";
  `)
}
