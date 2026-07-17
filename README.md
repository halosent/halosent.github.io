# Live Orthodox

A modern, static Eastern Orthodox Christian philosophy and apologetics website, owned and maintained by **Unified**. Built with Next.js (static export), TypeScript, Tailwind CSS, Framer Motion, and Lucide Icons, and designed to deploy directly to GitHub Pages — no backend, database, or server required.

## Features

- Home, Articles, Contradictions database, Philosophy/Topics, and About pages
- Markdown-driven content — add or edit articles and contradictions without touching code
- Full-text search, category/tag filtering, sorting, and pagination on the Articles page
- Searchable Contradictions database, filterable by Old Testament / New Testament / Historical / Philosophical / Scientific
- Immersive Reader mode on every article: adjustable font size, font family, line spacing, and reading width; light/sepia/dark themes; fullscreen; reading-progress bar; table of contents with scroll-spy; preferences saved locally
- Subtle animated backgrounds per page (aurora gradients, floating particles, a drifting geometric grid, low-opacity Byzantine cross motifs), all disabled/simplified automatically when the visitor has `prefers-reduced-motion` enabled
- SEO metadata, Open Graph and Twitter card tags, canonical URLs, and a generated `sitemap.xml` / `robots.txt`
- Fully static export (`next build` → `out/`), ready for GitHub Pages

## Getting Started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## Managing Content

All content lives in Markdown files — no code changes required to add, edit, or remove entries.

```
content/
 ├── articles/
 │    └── my-article-slug.md
 └── contradictions/
      └── my-entry-slug.md
```

The filename (minus `.md`) becomes the page's URL slug.

### Adding an article

Create `content/articles/your-slug.md`:

```md
---
title: "Article Title"
description: "A one- or two-sentence summary shown on cards and in search results."
author: "Live Orthodox"
date: "2026-07-01"
category: "Theology"
tags: ["Tag One", "Tag Two"]
featured: false
---

## First Heading

Your article body in Markdown. Headings (`##`, `###`) automatically populate
the table of contents and the Immersive Reader's contents panel.
```

`category` should be one of the values in `lib/content.ts` → `CATEGORIES` (edit that list to add a new category). Reading time is calculated automatically from the word count — no need to set it by hand. Set `featured: true` to surface an article in the homepage's Featured section.

### Adding a contradiction entry

Create `content/contradictions/your-slug.md`:

```md
---
title: "Entry Title"
claim: "The alleged contradiction, stated as the objection frames it."
type: "old-testament" # old-testament | new-testament | historical | philosophical | scientific
verses: ["Genesis 1:1", "Genesis 2:4"]
summary: "One or two sentences shown on the card and used for the meta description."
date: "2026-07-01"
---

## The Objection

...

## The Orthodox Response

...

## Historical Context

...

## Sources

...
```

### Removing content

Delete the corresponding `.md` file. The build regenerates all pages automatically — no other changes needed.

## Building for Production

```bash
npm run build
```

This runs `next build` (static export to `out/`) and then a script that generates `out/sitemap.xml` and `out/robots.txt` from your content files.

Preview the static output locally:

```bash
npx serve out
```

## Deploying to GitHub Pages

A ready-to-use workflow is included at `.github/workflows/deploy.yml`. It builds the site and publishes `out/` via GitHub's official Pages actions on every push to `main`.

To enable it:

1. Push this repository to GitHub.
2. In the repo, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Push to `main` (or run the workflow manually from the **Actions** tab).

### Project pages vs. custom domains

- If your site will live at `https://<username>.github.io/<repo>/` (a **project page**), the workflow automatically sets `NEXT_PUBLIC_BASE_PATH` to `/<repo>` during the build, via `actions/configure-pages`. No manual change needed.
- If you're deploying to a **user/organization page** (`https://<username>.github.io/`) or a **custom domain**, no base path is needed — the default configuration already works. If you add a custom domain, also add a `public/CNAME` file containing your domain name.

### Before your first real deploy

Open `lib/site.ts` and set `SITE.url` to your actual production URL (used for canonical links, Open Graph tags, and the sitemap). The workflow also passes this automatically via the `SITE_URL` environment variable, so updating `lib/site.ts` is mostly a fallback for local builds.

## Project Structure

```
app/                    Next.js App Router pages
  articles/[slug]/      Individual article pages
  contradictions/[slug]/ Individual contradiction pages
  philosophy/, about/   Static pages
components/             UI components (Nav, Footer, cards, Immersive Reader, etc.)
content/                Markdown content (articles, contradictions)
lib/                    Content loading, site config, table-of-contents helper
scripts/                Post-build sitemap/robots.txt generator
```

## Tech Stack

- **Next.js 14** (static export via `output: 'export'`)
- **TypeScript**
- **Tailwind CSS** (custom theme: Byzantine gold accent on a warm off-white palette)
- **Framer Motion** (available for additional motion; current animations are CSS-driven for performance)
- **Lucide Icons**
- **react-markdown** + **remark-gfm** for Markdown rendering (tables, footnotes, autolinked headings)

## Ownership

Live Orthodox is owned and maintained by **Unified**. All content, ownership, and credits belong to Unified.
