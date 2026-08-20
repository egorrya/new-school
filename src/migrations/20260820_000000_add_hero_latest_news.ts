import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_hero"
      ADD COLUMN IF NOT EXISTS "show_latest_news" boolean DEFAULT false;
    ALTER TABLE "_pages_v_blocks_hero"
      ADD COLUMN IF NOT EXISTS "show_latest_news" boolean DEFAULT false;
    ALTER TABLE "pages_blocks_hero_marquee"
      ADD COLUMN IF NOT EXISTS "show_latest_news" boolean DEFAULT true;
    ALTER TABLE "_pages_v_blocks_hero_marquee"
      ADD COLUMN IF NOT EXISTS "show_latest_news" boolean DEFAULT true;

    ALTER TABLE "pages_blocks_hero"
      ALTER COLUMN "show_latest_news" SET DEFAULT false;
    ALTER TABLE "_pages_v_blocks_hero"
      ALTER COLUMN "show_latest_news" SET DEFAULT false;
    ALTER TABLE "pages_blocks_hero_marquee"
      ALTER COLUMN "show_latest_news" SET DEFAULT true;
    ALTER TABLE "_pages_v_blocks_hero_marquee"
      ALTER COLUMN "show_latest_news" SET DEFAULT true;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_hero" DROP COLUMN IF EXISTS "show_latest_news";
    ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN IF EXISTS "show_latest_news";
    ALTER TABLE "pages_blocks_hero_marquee" DROP COLUMN IF EXISTS "show_latest_news";
    ALTER TABLE "_pages_v_blocks_hero_marquee" DROP COLUMN IF EXISTS "show_latest_news";
  `)
}
