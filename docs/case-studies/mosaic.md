# Case study draft: Mosaic

Status: **draft for Uvesh's approval.** Every statement below is visible in this repository; there are no metrics or outcomes beyond what the code does. Once approved, it is entered in the production admin as a Full-stack project with `links.demoAdmin` on, and its architecture below.

**Title:** Mosaic: this portfolio platform
**Summary:** One monorepo for a personal site with several profiles, a brand site, a headless admin, a public demo admin and a contact service.
**Role:** Sole developer · **Platforms:** Web · **Demo status:** Live · **Repository:** https://github.com/uveshm003/mosaic
**Stack:** Next.js, Payload, PostgreSQL, Cloudflare Workers, TypeScript, GitHub Actions

## The problem

Five portfolio profiles and a brand site, each with its own look, but one place to write content and no server to run or pay for.

## The approach

Payload is the only writer. A build step exports published content into a typed snapshot, and both Next.js sites are static exports built from it, so nothing calls the admin at runtime.

Environments are separated by code, not care: seeded documents carry a flag, the seed refuses the production database, and a production build fails if the snapshot contains seed data.

The contact form posts to a Cloudflare Worker that checks Turnstile and a honeypot, validates with Zod, inserts into Postgres as a role that can only insert inquiries, and sends one email.

## The outcome

Publishing is a button in the local admin that starts a GitHub Actions deploy to GitHub Pages. A public demo admin, reset every night, lets anyone look around as a read-only reviewer.

## Architecture

| Key     | Label          | Kind     | Tech               | Column, row |
| ------- | -------------- | -------- | ------------------ | ----------- |
| admin   | Local admin    | client   | Payload            | 0, 0        |
| db      | Neon Postgres  | data     | PostgreSQL         | 1, 1        |
| ci      | Export & build | service  | GitHub Actions     | 2, 0        |
| pages   | GitHub Pages   | external | Next.js            | 3, 0        |
| visitor | Visitor        | client   |                    | 3, 1        |
| worker  | Contact Worker | service  | Cloudflare Workers | 2, 2        |
| email   | Resend         | external |                    | 3, 2        |

Connections: admin → db (writes), admin → ci (Publish), ci → db (reads published), ci → pages (deploys), visitor → worker (contact form), worker → db (INSERT), worker → email (notify).

Request trace (a contact form submission): visitor → worker "Submit the contact form"; worker → db "Store the inquiry"; worker → email "Send one notification"; worker → visitor "200, message received". Each step carries the matching snippet from `workers/contact`.

## Before it goes live

- The demo admin card appears once the demo admin is deployed and its URL is set under Profiles → Full-stack (still waiting on the Vercel account).
