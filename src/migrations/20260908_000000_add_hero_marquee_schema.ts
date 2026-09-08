import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * HeroMarquee was added after the initial schema migration. Development used
 * Payload's schema push, but a production database only runs migrations, so
 * it was missing these tables and the media relationship columns.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "pages_blocks_hero_marquee" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "tagline" varchar,
      "title" varchar DEFAULT 'Школа, где детям интересно учиться',
      "description" varchar,
      "primary_button_label" varchar,
      "primary_button_link" varchar,
      "block_name" varchar,
      "title_emphasis" varchar,
      "secondary_button_label" varchar,
      "secondary_button_link" varchar,
      "show_latest_news" boolean DEFAULT true
    );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_hero_marquee" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "tagline" varchar,
      "title" varchar DEFAULT 'Школа, где детям интересно учиться',
      "description" varchar,
      "primary_button_label" varchar,
      "primary_button_link" varchar,
      "_uuid" varchar,
      "block_name" varchar,
      "title_emphasis" varchar,
      "secondary_button_label" varchar,
      "secondary_button_link" varchar,
      "show_latest_news" boolean DEFAULT true
    );

    ALTER TABLE "pages_rels" ADD COLUMN IF NOT EXISTS "media_id" integer;
    ALTER TABLE "_pages_v_rels" ADD COLUMN IF NOT EXISTS "media_id" integer;

    DO $$ BEGIN
      ALTER TABLE "pages_blocks_hero_marquee"
        ADD CONSTRAINT "pages_blocks_hero_marquee_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_hero_marquee"
        ADD CONSTRAINT "_pages_v_blocks_hero_marquee_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "pages_rels"
        ADD CONSTRAINT "pages_rels_media_fk"
        FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v_rels"
        ADD CONSTRAINT "_pages_v_rels_media_fk"
        FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "pages_blocks_hero_marquee_order_idx" ON "pages_blocks_hero_marquee" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_hero_marquee_parent_id_idx" ON "pages_blocks_hero_marquee" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_hero_marquee_path_idx" ON "pages_blocks_hero_marquee" USING btree ("_path");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_hero_marquee_order_idx" ON "_pages_v_blocks_hero_marquee" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_hero_marquee_parent_id_idx" ON "_pages_v_blocks_hero_marquee" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_hero_marquee_path_idx" ON "_pages_v_blocks_hero_marquee" USING btree ("_path");
    CREATE INDEX IF NOT EXISTS "pages_rels_media_id_idx" ON "pages_rels" USING btree ("media_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_rels_media_id_idx" ON "_pages_v_rels" USING btree ("media_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "pages_blocks_hero_marquee" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_hero_marquee" CASCADE;

    ALTER TABLE IF EXISTS "pages_rels" DROP CONSTRAINT IF EXISTS "pages_rels_media_fk";
    ALTER TABLE IF EXISTS "_pages_v_rels" DROP CONSTRAINT IF EXISTS "_pages_v_rels_media_fk";
    ALTER TABLE IF EXISTS "pages_rels" DROP COLUMN IF EXISTS "media_id";
    ALTER TABLE IF EXISTS "_pages_v_rels" DROP COLUMN IF EXISTS "media_id";
  `)
}
