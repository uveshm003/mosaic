# Flutter demos

Flutter web apps embedded in the Flutter portfolio's demo lab, each loaded only when the visitor presses Run.

- `demo_kit/`: the shared theme (the site's colours, bundled Inter and JetBrains Mono), the adaptive shell and layout helpers.
- One folder per demo. Its `web/flutter_bootstrap.js` points the engine and its default font at the shared copies in `/flutter/demos/engine/`, so the demos make no requests to Google.

```sh
pnpm demos:check   # pub get, analyze and test every package
pnpm demos:build   # build every demo into apps/site/public/flutter/demos/<slug>/ (git-ignored)
```

To add a demo: create it here with `demo_kit` as a path dependency, copy `web/index.html` and `web/flutter_bootstrap.js` from `animations`, add it to `apps/site/src/lib/demos.ts`, and save a 1024×768 screenshot as `apps/site/public/flutter/posters/<slug>.webp`.

The Flutter version is pinned in `.github/workflows/ci.yml` and `deploy.yml`. If an upgrade changes the engine's default font, the build names the file to add to `engine-fonts/`.
