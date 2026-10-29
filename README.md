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

Env templates: `apps/cms/.env.{dev,prod}.example`, `apps/site/.env.example`, `apps/brand/.env.example`, `workers/contact/.dev.vars.example`. Copy them without the `.example` suffix; the copies are git-ignored.
