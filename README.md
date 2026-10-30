# Mosaic

Monorepo for Uvesh Menpurwala's portfolio platform: a personal site with several profiles, a brand site, a Payload admin and a contact Worker. See [docs/SPEC.md](docs/SPEC.md).

## Layout

| Path               | What                                                          |
| ------------------ | ------------------------------------------------------------- |
| `apps/site`        | Personal site: root page and profiles (Next.js static export) |
| `apps/brand`       | Brand site (Next.js static export)                            |
| `apps/cms`         | Payload admin (Phase 1)                                       |
| `workers/contact`  | Contact form Worker                                           |
| `demos/flutter`    | Flutter web demos (Phase 2)                                   |
| `packages/content` | Collections, schemas and the content snapshot                 |
| `packages/ui`      | Unstyled primitives shared by both sites                      |
| `packages/tokens`  | Theme tokens per profile and for the brand                    |
| `packages/seed`    | Seed data and purge                                           |
| `packages/resume`  | Resume export                                                 |
| `packages/config`  | Shared TypeScript and ESLint config                           |

## Commands

Requires Node 24 (`.nvmrc`) and pnpm via Corepack (`corepack enable`).

```sh
pnpm install
pnpm build          # build every app
pnpm lint
pnpm typecheck
pnpm test
pnpm format         # Prettier
pnpm --filter @mosaic/site dev
pnpm --filter @mosaic/brand dev
```

### Admin (`apps/cms`)

The admin only starts through these commands, each reading its own env file
(`apps/cms/.env.dev`, `apps/cms/.env.prod`; values in the file win over the shell):

```sh
pnpm cms:dev    # dev database, schema synced from code, http://localhost:3000/admin
pnpm cms:prod   # production database, migrations only, http://localhost:3001/admin
```

Sample data (dev database only; `seed` refuses `APP_ENV=production` and the production host from `.env.prod`):

```sh
pnpm seed         # replace sample data: "Sample:" titles, every collection and profile, marked _seed
pnpm seed:purge   # delete every _seed document and blank seeded globals
```

Payload CLI commands go through the same files: `pnpm --filter @mosaic/cms payload:dev migrate:status`.

Integration tests and local admin work use the Postgres in `docker-compose.yml`:

```sh
docker compose up -d
pnpm --filter @mosaic/cms test
```

After changing a collection or global, regenerate the committed files (CI fails if they drift):

```sh
pnpm --filter @mosaic/cms generate:types
pnpm --filter @mosaic/cms generate:importmap
```

Both need `APP_ENV=test`, `DATABASE_URL` and `PAYLOAD_SECRET` set.

Env templates: `apps/cms/.env.{dev,prod}.example`, `apps/site/.env.example`, `apps/brand/.env.example`, `workers/contact/.dev.vars.example`. Copy them without the `.example` suffix; the copies are git-ignored.
