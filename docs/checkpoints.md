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

### Root page revised

2026-10-31. Uvesh found the editorial root too basic and too thin, so the design interview was run properly:

- Ambition: playful and interactive. References: Brittany Chiang's developer portfolio, Awwwards-style motion, Bruno Simon's playfulness (no WebGL; the spec keeps 3D on the brand site).
- Root sections: an interactive terminal, about with "currently building", draggable featured work, experience tabs, a skills board, a Flutter counter-app playground, writing, and contact with a form.
- Seed data now uses realistic, clearly fictional English instead of lorem ipsum, so reviews read like a real portfolio.
- The Flutter profile gets the same treatment next.

### Hub and Flutter redesigned with art direction

2026-10-31. Uvesh asked for the root to be a hub linking every portfolio (not a portfolio itself), for each portfolio to look like its own domain, and for less "AI-made" colour and glow.

- Root hub: "the name as a monument" in stone and blueprint, Erode. The surname is cut into one slice per portfolio and each slice links to it; pictures of Ahmedabad from open collections, credited on the page.
- Flutter: "the split stage" in blush, sage and slate (close to Material 3 tonal palettes), Pilcrow Rounded instead of the dealt serif, because a serif suits neither the domain nor a look distinct from the hub. The fixed half runs the app: terminal, then each project's screen, the counter app, then the six targets. Hummingbird plates nod to Dash; all public domain or CC BY-SA, credited.
- Both pass the art-direction inspector with no failures. Remaining warnings: no video (an honest clip would cost the mobile performance budget), and the Flutter type change above.

### Back to the dark, playful design

2026-10-31. Uvesh preferred the earlier dark, playful build to the art-directed one and asked for it on both pages, as it was.

- Flutter: the playful portfolio is restored (terminal, draggable work deck, experience tabs, skills board, counter-app playground, contact form).
- Root: a hub in the same style. A terminal where `ls` lists the portfolios and `cd <name>` opens a built one, a bento of portfolio cards (unbuilt ones say "Coming later"), about and contact.
- The art-directed versions (name monument, split stage) and their pictures and fonts are removed; they stay in this branch's history.
- Per-portfolio identities for Product, Freelance, Full-stack and Brand are still to be designed when those profiles are built.

## Phase 1: what waits

2026-10-31. Uvesh asked to keep the remaining Phase 1 account steps for later and move on: the Vercel deploy of the demo admin (with where demo media lives, since Vercel can't keep uploads on disk) and the Publish token. Phase 1 is not signed off yet.

- Media: Uvesh chose not to add a payment card, which Cloudflare needs before R2 can be enabled. Uploads stay on the admin's local disk for now; R2, or another store, gets decided later.

## Flutter demos

2026-10-31. Proposed: an animation playground, a simulated device dashboard, a Riverpod state visualiser and a Flame mini-game. Uvesh asked for all of them. They live in `demos/flutter`, share one engine copy and the site's theme, load no third-party resources, and load on the Flutter page only when the visitor presses Run.
