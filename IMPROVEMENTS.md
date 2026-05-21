# GongIdeas — Improvement Punch List

Audit pass on 2026-05-21. Grouped by impact. Status legend: `[ ]` todo · `[~]` in progress · `[x]` done.

## High impact (in flight this session)

- [~] **Social share / OG card.** Add `og:image`, `twitter:card`, `twitter:image` to `BaseLayout.astro`. Default + per-page override via `image` prop. Blog/idea detail pages pass their cover.
- [~] **Canonical URL + RSS alternate link.** Add `<link rel="canonical" href={Astro.url}>` and `<link rel="alternate" type="application/rss+xml" ...>` in `BaseLayout`.
- [~] **JSON-LD structured data.** `WebSite` + `Person` on home, `BlogPosting` on blog detail, `CreativeWork`/`Article` on idea detail.
- [~] **Sitemap.** Install `@astrojs/sitemap`, add to `astro.config.mjs`, add `public/robots.txt`.
- [~] **404 page.** `src/pages/404.astro` themed in parchment/pixel.

## Medium impact (queued — not in this session)

- [ ] Switch covers in `IdeaCard.astro` and `ideas/[slug].astro` to Astro `<Image>` from `astro:assets` for responsive `srcset` + WebP/AVIF.
- [ ] Self-host fonts (Fontsource) or async-load Google Fonts to remove render-blocking stylesheet.
- [ ] Add `<ClientRouter />` (View Transitions) + `data-astro-prefetch` on internal links.
- [ ] Derive `categoryFacets` in `ideas/index.astro` from the Zod enum (currently missing `ai-image` and `misc`).
- [ ] Extract duplicated `categoryClass` / `categoryLabel` / `statusLabel` maps into `src/lib/categories.ts`.
- [ ] Add reading time + word count to blog posts.
- [ ] Generate `/blog/tags/[tag]/` pages (currently tags are client-side filter only).
- [ ] Reflect filter state in URL (`?cat=ai-coding`, `?tag=foo`) for shareability.

## Low impact / polish

- [ ] Move `gtag` typing to `src/types/globals.d.ts` instead of `(window as any)` casts.
- [ ] Add `@media (prefers-reduced-motion: reduce)` rules for blink/cursor/Bulby animations.
- [ ] Add `prefers-color-scheme: dark` parchment-dark variant.
- [ ] Make `<CopyableCode />` a shared component (currently inline in `blog/[slug].astro`).
- [ ] Run `astro check` in CI (GitHub Action or pre-push hook).
- [ ] Split `global.css` (1959 lines) by domain once it crosses ~2k.

## Notes / outstanding

- An actual 1200×630 PNG for `public/og-default.png` must be hand-designed (Bulby + GONGIDEAS wordmark on parchment). The meta tag plumbing is wired and will pick it up the moment the file lands.
