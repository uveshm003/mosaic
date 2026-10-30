# Checkpoints

Answers from each checkpoint in `docs/SPEC.md`, recorded before work continues. Newest last.

## Accounts and domain (Phase 0)

2026-10-30

- Domain: not buying one. Both sites go on GitHub Pages at `uveshm003.github.io`, the brand under `/brand` (ADR 0002).
- Accounts: GitHub (`uveshm003`) only. Cloudflare, Neon, Resend and Vercel don't exist yet; create them in Phase 1 when each is first needed.
- Env values: none yet. Templates list every variable; real values go only in git-ignored env files and GitHub secrets.

## Phase 0 sign-off

2026-10-30. Uvesh signed off Phase 0 (repo and tooling). Phase 1 starts.

## Design interview: root page and Flutter profile

2026-10-31. The rest of Phase 1 (R2, the demo admin, the Publish token) is paused so the interface can be reviewed first.

- Three directions were built on seed data (editorial; dark and immersive; Swiss and technical). Uvesh left the choice to me.
- Root page: editorial (Fraunces and Inter, warm paper, drop cap, numbered profile index, scroll reveal off under reduced motion).
- Flutter profile: Swiss and technical (IBM Plex Sans and Mono, grid, case-study table with a platform per column, CSS-only platform filter).
- The dark, immersive direction was set aside: busiest visually, and the only one needing JavaScript.
- Still open for Phase 2: the about-me file, confidentiality per project, and the first Flutter demo.
