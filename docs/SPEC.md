# Portfolio Platform — Build Spec

Oct 30, 2026 · @Uvesh

## How to use this spec

This document is the source of truth for the build.

- **Decided means decided.** Don't reopen anything in the Decision log without asking Uvesh first.
- **Checkpoints mean stop.** At each checkpoint listed under Checkpoints, ask Uvesh and record the answer in `docs/checkpoints.md` before continuing.
- **One phase at a time.** A phase is done when its acceptance criteria pass and Uvesh signs off.
- **Missing facts are questions.** When a fact about Uvesh's work is missing, ask. Never fill it in.

## Overview

We are building Uvesh Menpurwala's portfolio platform: one monorepo that produces a personal site with five experiences, a standalone brand site, a local admin, a public demo admin and a contact service. Uvesh is a Flutter engineer with about three years of experience, based in Ahmedabad, India, and open to relocation.

| Output | What it is | Where it runs |
| --- | --- | --- |
| Personal site | Root "about me" page plus four profiles: Flutter, Product, Freelance, Full-stack | A free workers.dev address unless Uvesh buys a domain; name on the site is "Uvesh Menpurwala" |
| Brand site | Standalone brand for marketing, growth, branding and advertising | Its own free workers.dev address; its own domain only if one is bought |
| Admin | Payload CMS holding all content | Uvesh's laptop only |
| Demo admin | Read-only copy of the admin running on seed data, for reviewers | Public, linked from the Full-stack profile |
| Contact service | Receives contact-form submissions from every profile | Cloudflare Worker |
| Flutter demos | Flutter web builds embedded on the Flutter profile | Static files on the personal site |

Build order follows Uvesh's priorities: platform first, then the root page together with the Flutter profile, then Brand, Freelance, Full-stack and Product. The root ships with Flutter because it is the front door.

## The six experiences

Each experience has its own visual identity and its own job; they share content and infrastructure, never a look. Design hints come from Uvesh's original brief and are starting points for the design interview, not decisions.

| Experience | Audience | Must achieve | Primary action | Design starting hint |
| --- | --- | --- | --- | --- |
| Root ("about me") | Whoever lands first: recruiters, tech leads, founders | Impress on its own, even if the visitor never opens a profile | Open a profile | Editorial, immersive, interactive |
| Flutter (priority 1) | Indian product companies (Scapia, CRED calibre) and European employers, equally; senior engineers and tech leadership | Show Flutter depth across platforms, plus native Android | GitHub; otherwise explore the case studies | Clean, technical, performance-focused |
| Brand (priority 2) | CXOs, founders, marketing and creative heads at startups and brands; tech leaders who come across it | Build credibility for a brand that could become a business | Explore the content | Digital magazine, editorial, experimental |
| Freelance (priority 3) | Founders, startups and small businesses, any country | Make it easy to start a conversation | Contact form | Outcome-driven case studies, clear services |
| Full-stack (priority 4) | Employers hiring full-stack engineers | Show end-to-end systems | GitHub and the demo admin | Product dashboards, system diagrams, demos |
| Product (priority 5) | Product leaders and hiring managers | Show product judgement | Explore case studies and teardowns | Set at the design interview |

### Root

- About Uvesh as a person, separate from the brand. The source is a file about himself that Uvesh will provide (About-me checkpoint).
- No photo.
- Quiet links into each live profile; it may mention the brand.

### Flutter

- Case studies of Flutter apps across Android, iOS, macOS, Windows and Linux.
- A native section: Kotlin, platform channels, Android Nearby Connections and BLE inside Flutter apps; two or three new native showcases Uvesh will build with Jetpack Compose and Kotlin Multiplatform; his BitChord contribution, presented as a Kotlin Multiplatform shared module with a Compose Multiplatform desktop app, linked to the merged PR.
- A demo lab of embedded Flutter web builds. This is the profile's signature element.
- Optional writing, hidden while empty.

### Brand

- Starts with ideas and grows over time. Every content type is available and appears only once it has posts: essays, brand breakdowns, campaign concepts, book notes, research notes, YouTube videos.
- Its own site and identity, with a name tied to Uvesh (working name and alternatives under Open items). The name is a setting, so changing it later is a config edit.
- No newsletter, accounts or payments in the first year.

### Freelance

- General software-engineering services rather than Flutter only: mobile apps, web apps, backends and APIs, MVPs, maintenance. Final list at the design interview.
- How an engagement works, selected work reused from Projects with freelance wording, and a contact form.
- No prices, call booking or payments. The testimonials section stays hidden until a real testimonial exists.

### Full-stack

- QuickServe, Atomic Dev Tools, the Angular and NestJS web panel at Sensit (after its confidentiality checkpoint), and this platform as its own case study, linking the demo admin.
- Architecture diagrams, and a demo status on every project, since Uvesh's side apps are not live.

### Product

- Serves both product-management roles and product-minded engineering roles; framing confirmed at the Product checkpoint.
- Product case studies of Dasher, SyncIT and Odigo; teardowns of other companies' apps; improvement proposals for existing products.

## Content ground rules

Every word on the live sites must be something Uvesh did, said or approved. These rules override design and copy preferences.

1. **No invention.** No made-up experience, metrics, clients, testimonials or quotes. A missing fact is a question for Uvesh, never a placeholder in production.
2. **Credit wording.**
   - TakeProfit and Xandria (Kody client apps): "one of four developers working across every module".
   - Product work on Dasher, SyncIT and Odigo: led mainly by Uvesh and one colleague, with occasional guidance from a senior. Confirm the exact wording per project at its confidentiality checkpoint.
   - Odigo being shown at GITEX 2024 and deployed at LuLu Mall, DLF Mall and Jio World Drive are company outcomes and are worded that way.
3. **Kept off the site.** The Dasher Main Panel and the API encryption via platform channels.
4. **Confidentiality.** SyncIT (Halma India / Sensit), Odigo and Dasher (Kody clients) and the Sensit web panel show no internal screenshots, code or non-public details unless Uvesh confirms permission. Diagrams Uvesh approves are fine.
5. **Employer line.** "Halma India PLC", with "Software Engineer (Sensit Technologies)" beneath it. Uvesh confirmed this name.
6. **Automatic labels**, built into templates rather than typed:
   - Campaign concepts: "Concept, not commissioned work."
   - Teardowns and improvement proposals: "Independent analysis. Not affiliated with \<company>."
   - Projects: their demo status (live, demo build, video, repo only, private).
7. **Terminology.** "Kotlin Multiplatform" and "Compose Multiplatform", not "KMM". Name only technologies Uvesh actually used.
8. **Voice.** Personal profiles are plain and professional, with light humour at most and no hooky phrases or filler. The brand's voice is set at its design interview.

## Architecture

One pnpm + Turborepo monorepo in a public GitHub repo. Both public sites are static files built from a content snapshot; the admin writes content to Postgres and never runs in public with real data.

```
portfolio/
├── apps/
│   ├── site/        # personal domain: root + flutter, product, freelance, fullstack
│   ├── brand/       # standalone brand site
│   └── cms/         # Payload admin; local for production, deployed only as the demo admin
├── workers/
│   └── contact/     # contact form: Turnstile, insert into Neon, email via Resend
├── demos/
│   └── flutter/     # Flutter web demos, built in CI
├── packages/
│   ├── content/     # Payload config, collections, generated types, snapshot export
│   ├── ui/          # unstyled primitives shared by both sites
│   ├── tokens/      # one theme per profile, one for the brand
│   ├── seed/        # Faker seed data and purge
│   ├── resume/      # resume export to Markdown
│   └── config/      # tsconfig, ESLint, Prettier, Tailwind presets
├── docs/            # SPEC.md, checkpoints.md, decisions/
└── .github/workflows/
```

### Rendering

- `apps/site` and `apps/brand` are Next.js App Router apps using static export. No server code ships with them.
- At build time, `pnpm content:export` reads published documents through Payload's Local API and writes a typed JSON snapshot that both sites build from. CI generates the snapshot; it is never committed.
- Draft preview is local: `pnpm preview` exports with drafts included and starts a site's dev server.
- Images: Payload generates responsive sizes with sharp at upload time (the admin runs locally, so sharp is available). Sites use those sizes in `srcset`; there is no runtime image optimizer.
- Mermaid diagrams render to inline SVG at build time, and code blocks are highlighted at build time with Shiki. Neither ships JavaScript.
- YouTube embeds sit behind a click-to-load placeholder; the player loads only on click.

### Stack

Use the latest stable versions that Payload supports at Phase 0.

- TypeScript (strict), Next.js, React, Tailwind CSS, Zod.
- Motion for transitions. GSAP only where a profile needs choreographed scrolling. React Three Fiber only on the brand site, always lazy-loaded.
- shadcn/ui as the base for form controls, restyled per profile.
- Payload with its Postgres adapter. Rich text uses Lexical with custom blocks: code, Mermaid diagram, YouTube video, Flutter demo, image with caption, callout, metrics row, store links.

### Identity per profile

- Each profile in `apps/site` is a route group (`/`, `/flutter`, `/product`, `/freelance`, `/fullstack`) with its own layout, self-hosted fonts, token theme, motion language and component variants.
- Shared across profiles: content, primitives, SEO helpers, the accessibility baseline, and a quiet cross-link row in the footer. Nothing else is shared visually.
- A profile is built only when its `enabled` flag is on, so unfinished profiles never ship.

### Flutter demos

- Each demo is a Flutter web build with its own base href, copied into `apps/site/public/flutter/demos/<slug>/`.
- Embedded in an iframe behind a poster image; nothing loads until the visitor clicks.
- Use whichever Flutter web renderer the official docs recommend at Phase 0.

## Data model

A project is written once and can appear on any profile with its own wording there; that is how Freelance and Product reuse work without copying it. All collections and globals live in `packages/content`.

| Collection | Key fields | Rules |
| --- | --- | --- |
| projects | title, slug, summary, body, role, team, period, platforms, tech, links (store, repo, live, video), demoStatus, confidentiality, kind (work, freelance, personal, open source), employer, metrics, media, profiles, overrides | `overrides` holds per-profile title, summary, highlights, order and featured flag. `confidentiality: restricted` blocks publishing. Metrics only when Uvesh supplies them. |
| posts | title, slug, site (personal or brand), type, body, profiles, tags, cover, youtubeUrl, references, series, publishedAt | Types: essay, brand breakdown, campaign concept, book notes, research note, teardown, improvement proposal, case study, video. Automatic labels apply by type. |
| services | title, summary, deliverables, typical timeline, order | Freelance only. |
| testimonials | quote, name, role, company, project, consentConfirmed | Can't publish without consentConfirmed. Section hidden while none are published. |
| inquiries | profile, name, email, projectType, message, timeline, status (new, replied, archived) | Written by the contact Worker; triaged in the admin. |
| experience, education, skills | Standard resume fields plus variant flags (product company, Android, Flutter, broad, full-stack) | Feed About sections and the resume export. |
| tech | name, kind (language, framework, tool, platform) | Shared tags. |
| media | file, alt (required), caption, generated sizes | Stored in R2. |
| users | email, role (admin; reviewer on the demo only) | One admin user: Uvesh. |

| Global | Holds |
| --- | --- |
| person | Name, headlines, location, contact links, about-me content |
| profiles | Per profile: enabled, title, tagline, theme key, SEO defaults, primary action |
| brandSettings | Brand name (placeholder until chosen), domain, voice notes |
| siteSettings | Footer cross-links, analytics token |

Projects, posts, services and person keep drafts and version history. There is no scheduled publishing.

## Environments, seed data and guards

Real content exists only in production and seed data only in dev and demo; the code makes crossing that line fail rather than relying on care.

| Environment | Database | Media | Used by |
| --- | --- | --- | --- |
| dev | Neon project `portfolio`, branch `dev`, seeded | R2 bucket `portfolio-media-dev` | Local development |
| production | Neon project `portfolio`, branch `main`, real content only | R2 bucket `portfolio-media` | Uvesh's local admin; CI reads it to build |
| demo | Neon project `portfolio-demo`, seeded, reset nightly | R2 bucket `portfolio-media-demo` | The public demo admin |
| test | Postgres service container in GitHub Actions | None | Automated tests |

### Seed data

- Lives in `packages/seed`, uses Faker with a fixed seed so data and screenshots stay stable between runs.
- Covers every collection and every profile, including edge cases: long titles, missing media, many tags, empty sections.
- Every seeded document carries `_seed: true`, and `pnpm seed:purge` deletes them all.
- Dev seed titles start with "Sample:" so they can't pass for real content. Demo seed uses realistic but fictional names, and the demo admin shows a "Demo data, resets nightly" banner.

### Guards

- `pnpm seed` refuses to run when `APP_ENV=production` or when the database host matches the production branch.
- The production build fails if the snapshot contains any `_seed` document.
- The admin starts only through `pnpm cms:dev` or `pnpm cms:prod`, each loading its own env file.

## Publishing, hosting and cost

Everything runs on free tiers. A domain is the only possible cost, and Uvesh hasn't decided whether to buy one.

&#91;embedded content: publishing and contact flow · 7 parts\]

Publish is the only path from the admin to the live sites; the demo admin has its own database and no link to production.

### Publishing

1. Uvesh edits content in the local admin (`pnpm cms:prod`).
2. He presses Publish on the admin dashboard. It triggers GitHub's `workflow_dispatch` using a fine-grained token kept in his local env file.
3. The workflow exports the snapshot (published documents only), builds both sites and the Flutter demos, runs tests and Lighthouse CI, and deploys to Cloudflare.
4. The dashboard shows the last run's status. Pushes to `main` also deploy.

### Hosting

| Piece | Service (free tier) | Notes |
| --- | --- | --- |
| Personal site, brand site | Cloudflare Workers static assets | Free tier allows commercial use. Unless Uvesh buys domains, they run on `*.workers.dev`, with the brand set to `noindex`. |
| Contact service | Cloudflare Worker | Turnstile, a honeypot field and Zod validation; inserts into Neon through its serverless driver; one notification email via Resend (without a domain, Resend's default sender to Uvesh's own address; confirm in Phase 1 that the free tier allows this); CORS limited to the site origins. |
| Database | Neon | One branch or project per environment, as above. |
| Media | Cloudflare R2 | Images only. Video lives on YouTube. |
| Demo admin | Vercel Hobby | Seed data only, a read-only `reviewer` user, reset nightly by a GitHub Actions cron. A non-commercial demo. |
| DNS, registrar, email | Cloudflare | Only if a domain is bought. Email Routing then forwards a hello@ address to Uvesh's inbox. |
| Analytics | Cloudflare Web Analytics | No cookies, no consent banner. |
| CI | GitHub Actions | Free on a public repo. |

### Contact Worker contract

- `POST` with `profile`, `name`, `email`, `message`, optional `projectType` and `timeline`, the Turnstile token, and the honeypot field.
- On success: one row in `inquiries` and one notification email.
- A CI integration test runs Payload's migrations on the test database and checks the Worker's insert against the `inquiries` table, so schema drift fails the build.

### Cost

- Now: nothing. Every service above runs on a free tier.
- Optional: a personal domain, and later a brand domain, only if Uvesh decides to buy them (Cloudflare Registrar sells at cost).
- Upgrade path, only if Uvesh wants to edit away from his laptop: move the production admin to a low-cost Node host.
- No paid service without Uvesh's approval (Cost checkpoint).

## Checkpoints

At each checkpoint, stop, ask Uvesh, and record the answer in `docs/checkpoints.md` before continuing.

| Checkpoint | When | What to ask |
| --- | --- | --- |
| Accounts and domain | Start of Phase 0 | Which accounts exist (GitHub, Cloudflare, Neon, Resend, Vercel); domain status; env values. |
| About-me file | Before building the root page | Uvesh writes the file in the project folder. Read it from there, ask where it is if it's missing, and build the root page from it. |
| Design interview | Before each profile and before the brand | Feel in three to five words; sites liked and disliked; light, dark or both; type and motion intensity; one signature interaction. Then build two or three directions as static pages on seed data and let Uvesh pick. |
| Confidentiality | Before each employer or client project appears on any profile | What can be shown (screenshots, recordings, or diagrams only); exact credit wording; which metrics are approved. |
| Flutter demos | During the Flutter phase | Propose three or four demos that need no backend or hardware (for example a Flame mini-game, a widget and animation playground, a simulated device dashboard on fake data, a state-management visualiser) and build the one Uvesh picks. |
| Product framing | Start of the Product phase | Product-management roles, product-minded engineering roles, or both; which case studies, teardowns and proposals come first. |
| Brand name | Before the brand site is indexed | Confirm the working name or pick an alternative (see Open items), and whether to buy a domain. |
| Launch | Before any profile's `enabled` flag goes on in production | Final review with real content. |
| Cost | Any time | Any paid service, or any dependency that brings a cost. |

## Phases and acceptance criteria

Eight phases, each shippable on its own. Every phase also keeps Playwright smoke tests per profile, Vitest for content transforms and the Worker, and Lighthouse CI budgets green.

### Phase 0: Repo and tooling

Monorepo, shared configs, CI for lint, typecheck and unit tests, the `docs/` folder, env templates.

- [ ] `pnpm install && pnpm build` passes on a clean clone.
- [ ] CI runs lint, typecheck and tests on every push and pull request.
- [ ] `.env.example` files list every variable; no secrets committed.
- [ ] Accounts and domain checkpoint recorded.

### Phase 1: Platform

Payload with every collection and global; Neon environments; R2 storage; seed, purge and guards; snapshot export; Publish button and deploy workflow; placeholder pages on Cloudflare; contact Worker; demo admin with nightly reset.

- [ ] The admin runs against dev and production through separate commands, and the seed refuses production.
- [ ] The seed fills every collection; the purge removes every seeded document.
- [ ] Publish triggers a deploy that shows a content change on `*.workers.dev`.
- [ ] A production build with seed data in the snapshot fails (covered by a test).
- [ ] A contact submission lands in the admin and sends one email; Turnstile and the honeypot block a scripted submit.
- [ ] The demo admin is live, read-only for the reviewer user, and resets nightly.

### Phase 2: Root page and Flutter profile

About-me, design, confidentiality and demo checkpoints; the root page; Flutter home, project index with platform and tech filters, case-study template, native section, demo lab, writing list (hidden when empty).

- [ ] The root page stands on its own: who Uvesh is, with quiet links to each live profile.
- [ ] At least one Flutter demo is embedded and loads only on click.
- [ ] Lighthouse on mobile, every page: Performance 95+, Accessibility 95+, Best Practices 95+, SEO 100.
- [ ] Initial JavaScript at most 150 KB gzipped per page, demos excluded.
- [ ] WCAG 2.2 AA, full keyboard use, and `prefers-reduced-motion` turns motion off.
- [ ] Every employer or client project has passed its confidentiality checkpoint.
- [ ] Per-page metadata, generated Open Graph images, JSON-LD (Person on the root, CreativeWork or SoftwareApplication on projects), sitemap.

### Phase 3: Brand

Design interview; the brand app; editorial home; post templates by type; series; YouTube placeholder; automatic labels; RSS; brand name as a setting.

- [ ] Every post type renders on seed data, and types without posts stay out of navigation.
- [ ] Concept and independent-analysis labels render automatically.
- [ ] Lighthouse on mobile: Performance 85+, Accessibility 95+.
- [ ] `noindex` stays on until the brand-name checkpoint is done.

### Phase 4: Freelance

Design interview; services; how an engagement works; selected work through overrides; contact form.

- [ ] Projects reused from other profiles show their freelance wording and are not copies.
- [ ] With zero published testimonials, the section is hidden (covered by a test).
- [ ] The contact form works end to end from this profile.

### Phase 5: Full-stack

Design interview; case studies with build-time diagrams; demo status on every project; the platform's own case study, linking the demo admin with reviewer credentials.

- [ ] Every project shows its demo status.
- [ ] The demo admin link and reviewer login work from the case study.

### Phase 6: Product

Product framing checkpoint; design interview; product case studies, teardowns and improvement proposals.

- [ ] Teardowns and proposals carry the independent-analysis label.
- [ ] Dasher, SyncIT and Odigo pages have passed their confidentiality and credit-wording checkpoints.

### Phase 7: Resume export

`pnpm resume:export --variant <name>` writes Markdown in the exact structure of Uvesh's existing resume files (ask for them) for five variants: ProductCompany, Android, Flutter, Broad, Fullstack. His ReportLab script stays as the PDF step. This phase can move earlier on request.

- [ ] Each variant's output matches the structure of the existing file.
- [ ] The employer line follows the Halma India PLC format.

## Non-goals for v1

None of these get built, even partly, without a new decision from Uvesh: newsletter, member accounts, comments, payments, call booking, visible pricing, scheduled publishing, self-hosted video, multiple languages, a hosted production admin, a separately deployed app per profile, and any paid service.

## Decision log

These decisions were made with cost (free or nearly free) and Uvesh's priorities in mind. Reopen one only with Uvesh's agreement, and only when its trigger happens.

| Decision | Why | Revisit when |
| --- | --- | --- |
| Payload instead of a custom admin | Auth, roles, drafts, versions and media out of the box; MIT-licensed and actively maintained | Payload stops being maintained |
| Production admin runs locally | Payload on Cloudflare Workers needs the paid Workers plan because of bundle size; Vercel Hobby is non-commercial only; Netlify's free plan pauses every site once credits run out. Bonus: no public login page | Uvesh wants to edit away from his laptop |
| Static export for both sites | Free hosting, fastest pages, no server to attack | A feature genuinely needs server rendering |
| Cloudflare for public hosting | Free tier allows commercial use, which the Freelance profile and the brand need | Cloudflare's free terms change |
| Brand as a separate app | It has its own identity and address, so it can be renamed or moved without touching the personal site | Never, unless the brand is dropped |
| Build-time content snapshot | Sites don't depend on Payload at runtime; builds are reproducible | A feature needs live data |
| Neon Postgres | Free tier, plus branches per environment | Storage outgrows the free tier |
| R2 for images, YouTube for video | No video hosting cost | Never in v1 |
| Demo admin on Vercel Hobby | A non-commercial demo running on fake data | It starts serving anything commercial |
| Resume export to the existing Markdown | Keeps the working ReportLab pipeline; no new service | Uvesh wants PDFs generated in the repo |

Sources: [Vercel fair use guidelines](https://vercel.com/docs/limits/fair-use-guidelines) · [Payload on Cloudflare (D1 + R2) guide](https://www.buildwithmatija.com/blog/payload-cms-cloudflare-d1-r2-setup) · [Vercel vs Netlify free tiers, 2026](https://northflank.com/blog/vercel-vs-netlify-choosing-the-deployment-platform-in-2025) · [Payload maintenance status](https://ideaproof.io/open-source/project/payload-cms)

## Open items

Three items remain open. Everything else is either settled or handled at a checkpoint during development.

- [ ] Personal domain: Uvesh hasn't decided whether to buy one. Until he does, both sites run on free workers.dev addresses, and nothing in the build depends on a domain.
- [ ] Brand name: the working name is Menpur Studio. Before the brand-name checkpoint, check domain, social handle and trademark availability for it and for the alternatives below.

| Name | Why it fits |
| --- | --- |
| Menpur Studio (working name) | Short, drawn from Uvesh's surname, and reads as a studio that could grow into an agency |
| The Menpurwala Brief | A brief is where every campaign starts; suits a brand that begins as content |
| Studio Uvesh | The most direct link to Uvesh, and easy to remember |
| Brandwala | Echoes "Menpurwala" through the Hindi suffix "-wala"; playful and rooted in India, but the most likely to be taken |

- [ ] Project name: the working name is Facets, used for the repo and the package scope (`@facets/ui`, `@facets/content`). Each profile is one side of the same person.

| Name | Meaning | Why it fits |
| --- | --- | --- |
| Facets (working name) | From French *facette*, "little face": the flat cut faces of a gem, which together make it shine | Each profile is one face of the same person; short, and works as a package scope |
| Mosaic | A picture made from many small pieces of stone, glass or tile | Distinct profiles that form one picture; a common name, so expect search clashes |
| Kaleido | Short for kaleidoscope: Greek *kalos* ("beautiful") + *eidos* ("form") + *skopein* ("to look"); the same pieces, rearranged into new patterns | The same content, arranged into a different design on each profile |
| Atelier | French for an artist's or designer's workshop | The workshop where all the work gets made; suits the brand side too |

Settled: the employer line is "Halma India PLC", and the about-me file goes in the project folder. Handled at checkpoints during development: each profile's look, the first Flutter demo, the Product framing, and the existing resume Markdown files.
