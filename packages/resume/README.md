# @mosaic/resume

Exports the resume variants to Markdown from the content snapshot, in the exact structure of Uvesh's existing resume files. The PDF step stays outside the repo.

```sh
pnpm content:export                       # or a preview export for sample data
pnpm resume:export --variant Flutter      # ProductCompany, Android, Flutter, Broad, Fullstack or all
```

Files land in `exports/resume/` (git-ignored). What goes into each variant is set in the admin:

- **Person → Resume:** the name, phone, languages line and a headline per variant.
- **Experience and Education:** the whole entry by its variants (empty means every variant), and each bullet by its own variants, so wording can differ.
- **Skills:** by variant, grouped by category in order.
- **Projects → Resume:** one row per wording, with its variants, title, order, tagline and bullets.
