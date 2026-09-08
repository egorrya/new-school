import * as migration_20260729_071804_initial from './20260729_071804_initial'
import * as migration_20260814_153000_add_vacancy_application_fields from './20260814_153000_add_vacancy_application_fields'
import * as migration_20260818_220000_add_program_category_marquee from './20260818_220000_add_program_category_marquee'
import * as migration_20260820_000000_add_hero_latest_news from './20260820_000000_add_hero_latest_news'
import * as migration_20260908_000000_add_hero_marquee_schema from './20260908_000000_add_hero_marquee_schema'

export const migrations = [
  {
    up: migration_20260729_071804_initial.up,
    down: migration_20260729_071804_initial.down,
    name: '20260729_071804_initial',
  },
  {
    up: migration_20260814_153000_add_vacancy_application_fields.up,
    down: migration_20260814_153000_add_vacancy_application_fields.down,
    name: '20260814_153000_add_vacancy_application_fields',
  },
  {
    up: migration_20260818_220000_add_program_category_marquee.up,
    down: migration_20260818_220000_add_program_category_marquee.down,
    name: '20260818_220000_add_program_category_marquee',
  },
  {
    up: migration_20260820_000000_add_hero_latest_news.up,
    down: migration_20260820_000000_add_hero_latest_news.down,
    name: '20260820_000000_add_hero_latest_news',
  },
  {
    up: migration_20260908_000000_add_hero_marquee_schema.up,
    down: migration_20260908_000000_add_hero_marquee_schema.down,
    name: '20260908_000000_add_hero_marquee_schema',
  },
]
