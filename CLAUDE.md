# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Astro dev server (http://localhost:4321)
- `npm run build` — static build to `dist/`
- `npm run preview` — serve the built site locally
- `npx astro check` — type-check `.astro` and content frontmatter against the Zod schemas in `src/content.config.ts`

There is no test runner, linter, or formatter configured. `tsconfig.json` extends `astro/tsconfigs/strict`.

## High-level architecture

This is a **content-driven static Astro 5 site**. The big picture: drop a markdown file into `src/content/<collection>/`, and listings, detail pages, RSS, and HUD stats update automatically on next build.

### Content collections (the data layer)

`src/content.config.ts` defines two collections, both loaded with `glob({ pattern: '**/*.md', base: ... })`:

- **`ideas`** — `src/content/ideas/*.md`. Schema enforces `ideaId`, `category` (enum of 6), `status` (`shipped` | `wip` | `queued`), `difficulty` (1–5), and optional `progress` (used for WIP quest bars).
- **`blog`** — `src/content/blog/*.md`. Posts can declare `relatedIdea: <ideas-id>` to render a cross-link card on the post page (resolved via `getEntry('ideas', ...)`).

The slug is the file's `id` (filename without extension). `[slug].astro` pages exist for both collections and use `getStaticPaths` to also pass `prev`/`next` siblings sorted by `date desc` — so adding a post automatically rewires the surrounding posts' nav cards.

### Pages and routing

- `src/pages/index.astro` — home; pulls latest ideas/posts and computes `shippedCount` / `wipCount` / `latestWip` for the hero status panel.
- `src/pages/ideas/index.astro` and `src/pages/blog/index.astro` — listings with **client-side category/tag filtering** (chips toggle `aria-pressed` and a `.hidden` class on wrappers; no server-side filter routes).
- `src/pages/{ideas,blog}/[slug].astro` — detail pages; render markdown via `await render(entry)` then `<Content />`.
- `src/pages/rss.xml.ts` — RSS feed for the `blog` collection only.
- `astro.config.mjs` sets `trailingSlash: 'always'` and `build.format: 'directory'` — every internal link must end in `/` (e.g. `/ideas/${id}/`, not `/ideas/${id}`).

### Layout and shared chrome

`src/layouts/BaseLayout.astro` wraps every page with `<HudBar />` + `<Nav active={...} />` + `<slot />` + `<Footer />`. Two important patterns:

- **`HudBar` reads collections directly** (`getCollection('ideas')`, `getCollection('blog')`) to compute total counts and "LAST PATCH" age. It is rendered on every page, so any new top-level data added to a collection appears site-wide without touching individual pages.
- **`active` prop** drives nav highlighting — pass `'home' | 'ideas' | 'blog' | 'about'` from each page.

`TalkToBulby.astro` is a self-contained interactive FAQ component with its own `<script define:vars={...}>` block and a built-in mini-game. It's mounted at the bottom of most pages and optionally accepts `latestWip` / `latestPost` props (used on the homepage) to inject dynamic dialog content.

### Category/status label maps — duplicated on purpose

`categoryClass`, `categoryLabel`, and `statusLabel` lookup objects appear in **both** `src/components/IdeaCard.astro` and `src/pages/ideas/[slug].astro`. When adding a new category to the Zod enum, update both files plus the `categoryFacets` array in `src/pages/ideas/index.astro`.

### Design system

All styles live in a single `src/styles/global.css` (~1860 lines) imported once via `BaseLayout.astro`. Theme is "parchment + pixel/CRT":

- CSS variables: `--parchment`, `--ink`, `--orange`, `--yellow`, `--mint`, `--pink`, `--muted`.
- Three font stacks: `--font-pixel` (Press Start 2P), `--font-mono` (VT323), `--font-body` (Noto Sans Thai). **Press Start 2P and VT323 lack Thai glyphs**, so Noto Sans Thai is intentionally listed as the second family in the pixel/mono stacks for CSS glyph-fallback. Don't reorder the stacks.
- Reusable utility: `.pix-frame` (chunky 4px-offset shadow border) and `.pix-frame.deep` (inverted variant).
- The site **must remain responsive at desktop and mobile** — listings collapse to single column at `max-width: 640px`, and the hero/sheet/talk grids have mobile breakpoints already in `global.css`.

### Mascot

"Bulby" is the lightbulb sprite. The canonical SVG is **inline** in `src/components/BulbySprite.astro` (with built-in blink animation via `<animate>`). `public/assets/bulby.svg` is a separate copy used as favicon and in `Nav`/`Footer` `<img>` tags — keep them visually consistent if you change one.

## Things to ignore

- `gongideas-redesign/` — stale single-file HTML design exploration kept locally for reference. Excluded from `tsconfig.json`. Do not edit unless explicitly asked.
- Top-level `*.png` files in the repo root are design screenshots, not assets used by the site (real assets live in `public/assets/`).
- `.playwright-mcp/` is the Playwright MCP user data dir referenced by `.mcp.json`.
