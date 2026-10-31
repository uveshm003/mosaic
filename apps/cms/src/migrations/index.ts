import * as migration_20261030_182257_initial from './20261030_182257_initial';
import * as migration_20261030_190830_contact_worker_grants from './20261030_190830_contact_worker_grants';
import * as migration_20261031_092606_posts_subject from './20261031_092606_posts_subject';

export const migrations = [
  {
    up: migration_20261030_182257_initial.up,
    down: migration_20261030_182257_initial.down,
    name: '20261030_182257_initial',
  },
  {
    up: migration_20261030_190830_contact_worker_grants.up,
    down: migration_20261030_190830_contact_worker_grants.down,
    name: '20261030_190830_contact_worker_grants',
  },
  {
    up: migration_20261031_092606_posts_subject.up,
    down: migration_20261031_092606_posts_subject.down,
    name: '20261031_092606_posts_subject'
  },
];
