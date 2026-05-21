# GongIdeas — Improvement Punch List

Audit pass on 2026-05-21. Grouped by impact. Status legend: `[ ]` todo · `[~]` in progress · `[x]` done.

## High impact — DONE (commit `b43869b`, 2026-05-21)

- [x] **Social share / OG card.** `BaseLayout.astro` emits `og:image`, `og:image:alt`, `twitter:card=summary_large_image`, `twitter:image`. Defaults to `/og-default.png`; blog/idea detail pages override via `image` prop (blog uses optional `heroImage`, idea uses local `cover`).
- [x] **Canonical URL + RSS alternate link.** Canonical built from `Astro.url.pathname` + `Astro.site`, respects `trailingSlash: 'always'`. `<link rel="alternate" type="application/rss+xml">` wired.
- [x] **JSON-LD structured data.** `WebSite` + `Person` on home, `BlogPosting` on blog detail (with `mainEntityOfPage` as `{ @type: WebPage, @id }` object), `CreativeWork` on idea detail. All blocks parse as valid JSON; emitted as separate `<script type="application/ld+json">` tags.
- [x] **Sitemap.** `@astrojs/sitemap` installed and registered. Filter excludes `/404/` (uses `endsWith` so it won't accidentally drop other URLs containing `404`). `public/robots.txt` points to `sitemap-index.xml`.
- [x] **404 page.** `src/pages/404.astro` — parchment/pixel themed, Bulby sprite, HOME + IDEAS CTAs, mobile breakpoint, bilingual flavor copy. `Nav.active` union widened to `'none'` so the 404 doesn't highlight a real nav item.
- [x] **OG share image asset.** `public/og-default.png` — 1200×630, parchment background, GONGIDEAS wordmark + Bulby sprite + tagline. Generated from existing brand SVGs via `sharp`.

### Share buttons on detail pages — DONE (2026-05-21)

- [x] `src/components/ShareButtons.astro` — X, Facebook, LinkedIn, LINE, Copy link.
- [x] Wired into `blog/[slug].astro` (after content, before related-idea card) and `ideas/[slug].astro` (after content, before prev/next nav).
- [x] Absolute prod URLs built from `Astro.site`; titles `encodeURIComponent`-safe.
- [x] On-brand styling (parchment + pix-frame + pixel font); honors `prefers-reduced-motion`; 640px breakpoint.
- [x] `gtag('event', 'share', { method, content_type, item_id })` fires on click for both share-anchor and copy-link interactions.
- [x] While in there: removed the three remaining hardcoded `https://gongideas.com` literals in `ideas/[slug].astro`, now uses `Astro.site`.

### Bonus fixes folded into the same commit

- [x] `<html lang>` now a layout prop, default `th` (primary audience is Thai). `og:locale` set to `th_TH` with `en_US` as alternate.
- [x] `robots` meta with `max-image-preview:large` so Google shows full OG image in rich results.
- [x] Pre-existing `ts(2339) innerText` error in `blog/[slug].astro` copy-button script — fixed via `as HTMLElement` cast.
- [x] `heroImage` schema tightened to `regex(/^(\/|https?:\/\/)/)` so relative typos surface at build time.
- [x] All detail pages use `Astro.site` (with safe fallback) instead of hardcoded `https://gongideas.com`.

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

- Replace `public/og-default.png` with a polished version when there's time — the auto-generated one is on-brand but not designer-tuned.
- After deploy, paste the prod URLs into [Twitter Card Validator](https://cards-dev.twitter.com/validator), [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/), and [Google Rich Results Test](https://search.google.com/test/rich-results) to confirm card previews and JSON-LD render as expected.
- Submit `https://gongideas.com/sitemap-index.xml` to Google Search Console.

## Session log

- **2026-05-21** — High-impact pass (this session). Two commits on `main`: `b43869b` (SEO + sitemap + 404 + OG) and `e419537` (MynahPad idea #004). Verified via build + HTTP smoke (15 routes 200, JSON-LD valid, sitemap clean, 404 serves correctly).
