import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "form_submissions" ADD COLUMN IF NOT EXISTS "job_id" integer;
    ALTER TABLE "form_submissions" ADD COLUMN IF NOT EXISTS "age" numeric;
    ALTER TABLE "form_submissions" ADD COLUMN IF NOT EXISTS "city" varchar;
    ALTER TABLE "form_submissions" ADD COLUMN IF NOT EXISTS "email" varchar;
    ALTER TABLE "form_submissions" ADD COLUMN IF NOT EXISTS "education" varchar;
    ALTER TABLE "form_submissions" ADD COLUMN IF NOT EXISTS "educational_institution" varchar;
    ALTER TABLE "form_submissions" ADD COLUMN IF NOT EXISTS "specialty" varchar;
    ALTER TABLE "form_submissions" ADD COLUMN IF NOT EXISTS "work_experience" varchar;
    ALTER TABLE "form_submissions" ADD COLUMN IF NOT EXISTS "about" varchar;
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'form_submissions_job_id_jobs_id_fk'
          AND conrelid = 'public.form_submissions'::regclass
      ) THEN
        ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE set null ON UPDATE no action;
      END IF;
    END $$;
    CREATE INDEX IF NOT EXISTS "form_submissions_job_idx" ON "form_submissions" USING btree ("job_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "form_submissions_job_idx";
    ALTER TABLE "form_submissions" DROP CONSTRAINT IF EXISTS "form_submissions_job_id_jobs_id_fk";
    ALTER TABLE "form_submissions" DROP COLUMN IF EXISTS "about";
    ALTER TABLE "form_submissions" DROP COLUMN IF EXISTS "work_experience";
    ALTER TABLE "form_submissions" DROP COLUMN IF EXISTS "specialty";
    ALTER TABLE "form_submissions" DROP COLUMN IF EXISTS "educational_institution";
    ALTER TABLE "form_submissions" DROP COLUMN IF EXISTS "education";
    ALTER TABLE "form_submissions" DROP COLUMN IF EXISTS "email";
    ALTER TABLE "form_submissions" DROP COLUMN IF EXISTS "city";
    ALTER TABLE "form_submissions" DROP COLUMN IF EXISTS "age";
    ALTER TABLE "form_submissions" DROP COLUMN IF EXISTS "job_id";
  `)
}
