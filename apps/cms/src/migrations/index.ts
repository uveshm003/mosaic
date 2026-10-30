import * as migration_20261030_182257_initial from './20261030_182257_initial';

export const migrations = [
  {
    up: migration_20261030_182257_initial.up,
    down: migration_20261030_182257_initial.down,
    name: '20261030_182257_initial'
  },
];
