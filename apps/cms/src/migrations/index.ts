import * as migration_20261030_182257_initial from './20261030_182257_initial';
import * as migration_20261030_190830_contact_worker_grants from './20261030_190830_contact_worker_grants';
import * as migration_20261031_092606_posts_subject from './20261031_092606_posts_subject';
import * as migration_20261031_103100_freelance_profile from './20261031_103100_freelance_profile';
import * as migration_20261031_112707_fullstack_architecture from './20261031_112707_fullstack_architecture';

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
    name: '20261031_092606_posts_subject',
  },
  {
    up: migration_20261031_103100_freelance_profile.up,
    down: migration_20261031_103100_freelance_profile.down,
    name: '20261031_103100_freelance_profile',
  },
  {
    up: migration_20261031_112707_fullstack_architecture.up,
    down: migration_20261031_112707_fullstack_architecture.down,
    name: '20261031_112707_fullstack_architecture'
  },
];
