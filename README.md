# GongIdeas

> *Let's imagine come true.*

Personal site of **Gong (Narathip)** — a Bangkok-based indie builder shipping AI experiments. GongIdeas is the public log of those experiments: AI Coding, AI Automation, AI Image/Video Gen, Game Dev, and personal AI projects.

Live: https://gongideas.com

## Stack

- [Astro 5](https://astro.build/) static site
- Content collections (Markdown + Zod-validated frontmatter)
- `@astrojs/rss` for the blog feed
- A single hand-authored `global.css` — parchment + pixel/CRT theme
- TypeScript (`astro/tsconfigs/strict`)
- Fonts: Press Start 2P, VT323, Noto Sans Thai (Google Fonts)

No build framework gymnastics, no CSS framework, no JS framework — just Astro and CSS.

## Quick start

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # static output to dist/
npm run preview      # serve the build locally
npx astro check      # type-check .astro + content frontmatter
```

## Project layout

```
src/
├── content.config.ts          # Zod schemas for the two collections
├── content/
│   ├── ideas/*.md             # one file per experiment / project
│   └── blog/*.md              # one file per dev-log post
├── pages/
│   ├── index.astro            # home (hero, recent ideas, recent posts)
│   ├── about.astro            # character sheet
│   ├── rss.xml.ts             # blog RSS feed
│   ├── ideas/{index,[slug]}.astro
│   └── blog/{index,[slug]}.astro
├── layouts/BaseLayout.astro   # HudBar + Nav + slot + Footer
├── components/                # IdeaCard, DevLogLine, BulbySprite, TalkToBulby, …
└── styles/global.css          # the entire design system
public/assets/                 # bulby.svg favicon + logo
```

## Adding content

### A new idea / experiment

Create `src/content/ideas/<slug>.md`:

```yaml
---
title: "Your Idea Title"
ideaId: "005"
summary: "One-line pitch in Thai or English."
category: "ai-coding"          # ai-coding | ai-automation | ai-video | ai-image | game-dev | misc
status: "wip"                  # shipped | wip | queued
difficulty: 3                  # 1–5
date: 2026-05-01
tools: ["Claude Code", "TypeScript"]
progress: 40                   # optional, 0–100, used for WIP quest bars
reads: 0                       # optional
cover: "COVER · TBD"           # optional caption shown on the card
repoUrl: "https://github.com/..."  # optional
liveUrl: "https://..."             # optional
---

## Why this quest
Markdown body here.
```

Listing pages, the homepage hero counters, the HUD bar, and prev/next sibling nav all rebuild automatically.

### A new blog post

Create `src/content/blog/<slug>.md`:

```yaml
---
title: "Post title"
summary: "One-line summary."
date: 2026-05-01
tags: ["ai-coding", "claude"]
relatedIdea: "claude-sub-agents"   # optional — must match an ideas filename
---

Markdown body here.
```

If `relatedIdea` is set, the post page renders a cross-link card to that idea.

## Design notes

- **Trailing slashes are required** on every internal link (`astro.config.mjs` sets `trailingSlash: 'always'`).
- The site is responsive — there are explicit mobile breakpoints in `global.css` for the hero, listings, character sheet, and Talk-To-Bulby grids.
- Thai glyphs fall back through the font stacks: pixel/mono fonts → Noto Sans Thai. Don't reorder the stacks in `:root`.
- The Bulby mascot exists in two places: an animated inline SVG in `src/components/BulbySprite.astro`, and `public/assets/bulby.svg` used as favicon + brand mark. Keep them visually consistent.

## Deployment

Hosted on a Hostinger VPS (`72.62.65.76`) via **Dokploy** + **Docker** + **Traefik**.

| | |
|---|---|
| **Live URLs** | `https://gongideas.com`, `https://www.gongideas.com` |
| **Build** | `Dockerfile` — node:20-alpine builds `dist/`, nginx:alpine serves it |
| **CI/CD** | Push to `main` → GitHub App webhook → Dokploy auto-deploys |
| **SSL** | Let's Encrypt via Traefik (auto-renews) |
| **DNS** | Cloudflare — A record `@` → `72.62.65.76` (DNS only), CNAME `www` → `gongideas.com` |

To deploy manually: push to `main`, or call the webhook:
```
POST http://srv1168618.hstgr.cloud:3000/api/deploy/yC9yZqQ-vRyoNQLVU4Dq8
```

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start the Astro dev server with HMR |
| `npm run build` | Static build to `dist/` |
| `npm run preview` | Serve the built site |
| `npm run astro` | Pass-through to the Astro CLI |

## Contact

- Email — contact@gongideas.com
- GitHub — [@90n9](https://github.com/90n9)
- LinkedIn — [Narathip Harijiratiwong](https://www.linkedin.com/in/narathip-harijiratiwong-a96a0683/)
- RSS — `/rss.xml`

## License

Personal project — all rights reserved unless stated otherwise on a specific page or post.
