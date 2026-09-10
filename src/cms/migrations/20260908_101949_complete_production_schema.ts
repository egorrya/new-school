import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Keeps a freshly migrated production database compatible with the current
 * Payload configuration. Development previously received these changes via
 * schema push, while production only received the older initial migration.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    DECLARE enum_name text;
    BEGIN
      FOREACH enum_name IN ARRAY ARRAY[
        'enum_pages_blocks_audience_items_icon',
        'enum_pages_blocks_program_items_icon',
        'enum__pages_v_blocks_audience_items_icon',
        'enum__pages_v_blocks_program_items_icon',
        'enum_clubs_blocks_audience_items_icon',
        'enum_clubs_blocks_program_items_icon'
      ] LOOP
        BEGIN
          EXECUTE format('CREATE TYPE %I AS ENUM (''baby'', ''users'', ''star'', ''calendar-days'', ''clock'', ''graduation-cap'', ''book-open'', ''heart-handshake'', ''sparkles'', ''palette'', ''music'', ''mic'', ''utensils'', ''pen-tool'', ''trophy'', ''award'', ''wallet'', ''flask-conical'', ''languages'', ''calculator'', ''compass'', ''globe'', ''party-popper'', ''lightbulb'', ''check-circle'', ''target'')', enum_name);
        EXCEPTION WHEN duplicate_object THEN NULL;
        END;
      END LOOP;

      FOREACH enum_name IN ARRAY ARRAY[
        'enum_pages_blocks_collection_grid_card_design',
        'enum__pages_v_blocks_collection_grid_card_design',
        'enum_clubs_blocks_collection_grid_card_design'
      ] LOOP
        BEGIN
          EXECUTE format('CREATE TYPE %I AS ENUM (''default'', ''category'')', enum_name);
        EXCEPTION WHEN duplicate_object THEN NULL;
        END;
      END LOOP;

      FOREACH enum_name IN ARRAY ARRAY[
        'enum_pages_blocks_teacher_spotlight_image_position',
        'enum__pages_v_blocks_teacher_spotlight_image_position'
      ] LOOP
        BEGIN
          EXECUTE format('CREATE TYPE %I AS ENUM (''left'', ''right'')', enum_name);
        EXCEPTION WHEN duplicate_object THEN NULL;
        END;
      END LOOP;

      BEGIN
        CREATE TYPE "enum_clubs_tabs_icon" AS ENUM ('baby', 'users', 'star', 'calendar-days', 'clock', 'graduation-cap', 'book-open', 'heart-handshake', 'sparkles', 'palette', 'music', 'mic', 'utensils', 'pen-tool', 'trophy', 'award', 'wallet');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END;
      BEGIN
        CREATE TYPE "enum_form_submissions_education" AS ENUM ('higher', 'vocational');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END;
    END $$;

    CREATE TABLE IF NOT EXISTS "pages_blocks_text_image_items" (
      "_order" integer NOT NULL, "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL, "text" varchar
    );
    CREATE TABLE IF NOT EXISTS "pages_blocks_school_life" (
      "_order" integer NOT NULL, "_parent_id" integer NOT NULL, "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL, "title" varchar DEFAULT 'Больше, чем учеба',
      "description" varchar DEFAULT 'Дружелюбная атмосфера, праздники, внеклассные мероприятия, разнообразные экскурсии, литературные гостиные, театральные постановки — все для раскрытия талантов каждого ребенка.',
      "block_name" varchar
    );
    CREATE TABLE IF NOT EXISTS "pages_blocks_teacher_spotlight" (
      "_order" integer NOT NULL, "_parent_id" integer NOT NULL, "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL, "eyebrow" varchar, "title" varchar, "text" varchar,
      "closing_text" varchar, "button_label" varchar, "button_link" varchar,
      "image_position" "enum_pages_blocks_teacher_spotlight_image_position" DEFAULT 'right', "block_name" varchar
    );
    CREATE TABLE IF NOT EXISTS "pages_blocks_teacher_spotlight_items" (
      "_order" integer NOT NULL, "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL, "text" varchar
    );
    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_text_image_items" (
      "_order" integer NOT NULL, "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL, "text" varchar, "_uuid" varchar
    );
    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_school_life" (
      "_order" integer NOT NULL, "_parent_id" integer NOT NULL, "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL, "title" varchar DEFAULT 'Больше, чем учеба',
      "description" varchar DEFAULT 'Дружелюбная атмосфера, праздники, внеклассные мероприятия, разнообразные экскурсии, литературные гостиные, театральные постановки — все для раскрытия талантов каждого ребенка.',
      "_uuid" varchar, "block_name" varchar
    );
    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_teacher_spotlight" (
      "_order" integer NOT NULL, "_parent_id" integer NOT NULL, "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL, "eyebrow" varchar, "title" varchar, "text" varchar,
      "closing_text" varchar, "button_label" varchar, "button_link" varchar,
      "image_position" "enum__pages_v_blocks_teacher_spotlight_image_position" DEFAULT 'right',
      "_uuid" varchar, "block_name" varchar
    );
    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_teacher_spotlight_items" (
      "_order" integer NOT NULL, "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL, "text" varchar, "_uuid" varchar
    );
    CREATE TABLE IF NOT EXISTS "clubs_blocks_text_image_items" (
      "_order" integer NOT NULL, "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL, "text" varchar NOT NULL
    );

    ALTER TABLE "pages_blocks_hero"
      ADD COLUMN IF NOT EXISTS "secondary_button_label" varchar,
      ADD COLUMN IF NOT EXISTS "secondary_button_link" varchar;
    ALTER TABLE "pages_blocks_text_image"
      ADD COLUMN IF NOT EXISTS "closing_text" varchar,
      ADD COLUMN IF NOT EXISTS "button_label" varchar,
      ADD COLUMN IF NOT EXISTS "button_link" varchar;
    ALTER TABLE "pages_blocks_audience_items" ADD COLUMN IF NOT EXISTS "icon" "enum_pages_blocks_audience_items_icon";
    ALTER TABLE "pages_blocks_program_items" ADD COLUMN IF NOT EXISTS "icon" "enum_pages_blocks_program_items_icon";
    ALTER TABLE "pages_blocks_schedule_schedule_items" ADD COLUMN IF NOT EXISTS "club_id" integer;
    ALTER TABLE "pages_blocks_schedule"
      ADD COLUMN IF NOT EXISTS "hide_title" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "view_all_link" varchar,
      ADD COLUMN IF NOT EXISTS "view_all_label" varchar DEFAULT 'Посмотреть расписание всех кружков';
    ALTER TABLE "pages_blocks_collection_grid"
      ADD COLUMN IF NOT EXISTS "manual_selection" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "category_filter_id" integer,
      ADD COLUMN IF NOT EXISTS "card_design" "enum_pages_blocks_collection_grid_card_design" DEFAULT 'default';
    ALTER TABLE "pages_blocks_faq_items" ADD COLUMN IF NOT EXISTS "category" varchar;
    ALTER TABLE "pages_blocks_tabs" ADD COLUMN IF NOT EXISTS "hide_navigation" boolean DEFAULT false;
    ALTER TABLE "pages_rels"
      ADD COLUMN IF NOT EXISTS "media_id" integer,
      ADD COLUMN IF NOT EXISTS "clubs_id" integer;

    ALTER TABLE "_pages_v_blocks_hero"
      ADD COLUMN IF NOT EXISTS "secondary_button_label" varchar,
      ADD COLUMN IF NOT EXISTS "secondary_button_link" varchar;
    ALTER TABLE "_pages_v_blocks_text_image"
      ADD COLUMN IF NOT EXISTS "closing_text" varchar,
      ADD COLUMN IF NOT EXISTS "button_label" varchar,
      ADD COLUMN IF NOT EXISTS "button_link" varchar;
    ALTER TABLE "_pages_v_blocks_audience_items" ADD COLUMN IF NOT EXISTS "icon" "enum__pages_v_blocks_audience_items_icon";
    ALTER TABLE "_pages_v_blocks_program_items" ADD COLUMN IF NOT EXISTS "icon" "enum__pages_v_blocks_program_items_icon";
    ALTER TABLE "_pages_v_blocks_schedule_schedule_items" ADD COLUMN IF NOT EXISTS "club_id" integer;
    ALTER TABLE "_pages_v_blocks_schedule"
      ADD COLUMN IF NOT EXISTS "hide_title" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "view_all_link" varchar,
      ADD COLUMN IF NOT EXISTS "view_all_label" varchar DEFAULT 'Посмотреть расписание всех кружков';
    ALTER TABLE "_pages_v_blocks_collection_grid"
      ADD COLUMN IF NOT EXISTS "manual_selection" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "category_filter_id" integer,
      ADD COLUMN IF NOT EXISTS "card_design" "enum__pages_v_blocks_collection_grid_card_design" DEFAULT 'default';
    ALTER TABLE "_pages_v_blocks_faq_items" ADD COLUMN IF NOT EXISTS "category" varchar;
    ALTER TABLE "_pages_v_blocks_tabs" ADD COLUMN IF NOT EXISTS "hide_navigation" boolean DEFAULT false;
    ALTER TABLE "_pages_v_rels"
      ADD COLUMN IF NOT EXISTS "media_id" integer,
      ADD COLUMN IF NOT EXISTS "clubs_id" integer;

    ALTER TABLE "clubs_blocks_text_image"
      ADD COLUMN IF NOT EXISTS "closing_text" varchar,
      ADD COLUMN IF NOT EXISTS "button_label" varchar,
      ADD COLUMN IF NOT EXISTS "button_link" varchar;
    ALTER TABLE "clubs_blocks_audience_items" ADD COLUMN IF NOT EXISTS "icon" "enum_clubs_blocks_audience_items_icon";
    ALTER TABLE "clubs_blocks_program_items" ADD COLUMN IF NOT EXISTS "icon" "enum_clubs_blocks_program_items_icon";
    ALTER TABLE "clubs_blocks_schedule_schedule_items" ADD COLUMN IF NOT EXISTS "club_id" integer;
    ALTER TABLE "clubs_blocks_schedule"
      ADD COLUMN IF NOT EXISTS "hide_title" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "view_all_link" varchar,
      ADD COLUMN IF NOT EXISTS "view_all_label" varchar DEFAULT 'Посмотреть расписание всех кружков';
    ALTER TABLE "clubs_blocks_collection_grid"
      ADD COLUMN IF NOT EXISTS "manual_selection" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "category_filter_id" integer,
      ADD COLUMN IF NOT EXISTS "card_design" "enum_clubs_blocks_collection_grid_card_design" DEFAULT 'default';
    ALTER TABLE "clubs_blocks_faq_items" ADD COLUMN IF NOT EXISTS "category" varchar;
    ALTER TABLE "clubs_tabs" ADD COLUMN IF NOT EXISTS "icon" "enum_clubs_tabs_icon";
    ALTER TABLE "clubs"
      ADD COLUMN IF NOT EXISTS "use_tabs_navigation" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "link_to_category_id" integer,
      ADD COLUMN IF NOT EXISTS "custom_back_link_href" varchar,
      ADD COLUMN IF NOT EXISTS "custom_back_link_label" varchar;
    ALTER TABLE "clubs_rels" ADD COLUMN IF NOT EXISTS "clubs_id" integer;
    ALTER TABLE "clubs_blocks_schedule_schedule_items" ALTER COLUMN "label" DROP NOT NULL;

    ALTER TABLE "program_categories"
      ADD COLUMN IF NOT EXISTS "page_title" varchar,
      ADD COLUMN IF NOT EXISTS "show_program_marquee" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "sort_order" numeric DEFAULT 0;
    ALTER TABLE "form_submissions"
      ADD COLUMN IF NOT EXISTS "job_id" integer,
      ADD COLUMN IF NOT EXISTS "age" numeric,
      ADD COLUMN IF NOT EXISTS "city" varchar,
      ADD COLUMN IF NOT EXISTS "email" varchar,
      ADD COLUMN IF NOT EXISTS "education" "enum_form_submissions_education",
      ADD COLUMN IF NOT EXISTS "educational_institution" varchar,
      ADD COLUMN IF NOT EXISTS "specialty" varchar,
      ADD COLUMN IF NOT EXISTS "work_experience" varchar,
      ADD COLUMN IF NOT EXISTS "about" varchar;

    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'form_submissions'
          AND column_name = 'education' AND udt_name = 'varchar'
      ) THEN
        ALTER TABLE "form_submissions"
          ALTER COLUMN "education" TYPE "enum_form_submissions_education"
          USING CASE
            WHEN "education" IN ('higher', 'vocational') THEN "education"::"enum_form_submissions_education"
            ELSE NULL
          END;
      END IF;
    END $$;
  `)
}

// This is intentionally additive: production may already contain some of the
// schema from an earlier deployment, so a destructive rollback is unsafe.
export async function down(_: MigrateDownArgs): Promise<void> {}
