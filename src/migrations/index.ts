import * as migration_20260729_071804_initial from './20260729_071804_initial';
import * as migration_20260814_153000_add_vacancy_application_fields from './20260814_153000_add_vacancy_application_fields';

export const migrations = [
  {
    up: migration_20260729_071804_initial.up,
    down: migration_20260729_071804_initial.down,
    name: '20260729_071804_initial'
  },
  {
    up: migration_20260814_153000_add_vacancy_application_fields.up,
    down: migration_20260814_153000_add_vacancy_application_fields.down,
    name: '20260814_153000_add_vacancy_application_fields'
  },
];
