# 0002. Host both sites on GitHub Pages

Date: 2026-10-30
Status: Accepted. Supersedes the "Cloudflare for public hosting" row in the spec's decision log.

## Context

The spec hosted both static sites on Cloudflare Workers static assets at `*.workers.dev` addresses, because Cloudflare's free tier allows commercial use. At the Accounts and domain checkpoint Uvesh chose not to buy a domain and to use his GitHub address instead.

## Decision

- The personal site is served from GitHub Pages at `https://uveshm003.github.io/`.
- The brand site is served from the same Pages site under `/brand` (Next.js `basePath`), still built as its own app.
- Pages for a user site must live in a repo named `uveshm003.github.io`. The deploy workflow in this repo builds both apps and the Flutter demos, merges the output, and publishes it there.
- Cloudflare stays for the contact Worker, Turnstile, R2 media and Web Analytics.

## Consequences

- The brand has no address of its own until a domain is bought. Because it is still a separate app, moving it is a `basePath` and deploy change.
- GitHub Pages' terms rule out sites primarily directed at commercial transactions or SaaS. A portfolio with a freelance contact form fits; the brand is accepted as a risk while it is content only. Revisit if the brand starts selling anything.
- Pages can't set custom response headers, so no HTTP security or cache headers. A CSP, where needed, goes in a `<meta>` tag. Flutter WebAssembly demos can't get the cross-origin isolation headers that multi-threaded rendering needs; check the impact at the Flutter demos checkpoint.
- Limits: 1 GB published site and a soft 100 GB/month bandwidth, enough for this site.
- The contact Worker's CORS allows the `uveshm003.github.io` origin.
- The `uveshm003.github.io` repo and the cross-repo deploy token are created in Phase 1, with the deploy workflow.
