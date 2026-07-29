import * as migration_20260729_071804_initial from './20260729_071804_initial';

export const migrations = [
  {
    up: migration_20260729_071804_initial.up,
    down: migration_20260729_071804_initial.down,
    name: '20260729_071804_initial'
  },
];
