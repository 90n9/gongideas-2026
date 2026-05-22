---
name: create-post-content
description: Draft a new blog post for the GongIdeas site. Use this skill whenever the user says "create post content", "create a new post", "write a blog post", "draft a post about X", "new content about X", "เขียน blog เรื่อง...", "ทำ content เรื่อง...", or otherwise asks for a new entry under src/content/blog/. The skill produces a Thai-content / English-title markdown file matching the site's existing tone, frontmatter schema, and structure — and offers draft / OG / commit follow-ups.
---

# create-post-content — Draft a GongIdeas Blog Post

Creates a new markdown file under `src/content/blog/<slug>.md` that fits the existing site's voice and schema, so the post can be reviewed and shipped with one push.

## What you need from the user

- **Topic** (required) — what the post is about. A tool, a service, a workflow, a lesson learned. Take the topic from the conversation if the user already explained it; only ask if it's truly unclear.
- **Reference link(s)** (optional) — repos, docs, courses, products to link. Inline them in the post when given.
- **Draft?** (optional) — if the user wants to queue it for later release, set `draft: true` in the frontmatter. If they don't say, default to **not** draft (publish now).
- **Date** (optional) — defaults to today. If the user is queueing drafts in sequence, pick the next day after the most recent draft already in `src/content/blog/`.

If a piece is missing and the user hasn't given enough context to make a reasonable call, ask one short question. Otherwise just go.

## Site conventions (must follow)

### Frontmatter schema

Defined in `src/content.config.ts`. Required + supported fields:

```yaml
---
title: "English Title Case"
summary: "Thai one-line hook — explains the post in plain words, no marketing fluff"
date: 2026-MM-DD
tags: ["ai-coding", "skills"]   # array of kebab-case strings
draft: true                      # optional, omit unless queueing
relatedIdea: <ideas-id>          # optional, links to src/content/ideas/<id>.md
heroImage: /path/to/img.png      # optional
---
```

**Rules:**
- Title is **English**, content is **Thai**.
- Summary is a single line in Thai, ~120–180 characters, no period at the end.
- `date` is ISO format (`YYYY-MM-DD`).
- `tags` is always an array, even with one element. Common tags already in use: `ai-coding`, `automation`, `claude`, `claude-code`, `skills`, `design`, `astro`, `learning`.

### Voice & tone

- First-person, casual, conversational Thai. Use **ผม** and end key sentences with **ครับ** sparingly (not every line).
- Mix Thai with English **technical terms** in their original form — `skill`, `deploy`, `component`, `AI`, `code`, `design`, `bug`, `token`, `frontmatter`. Don't translate these.
- Avoid emoji and decorative Unicode (◆ ★ 🚀). The site's pixel/parchment theme is the visual layer; prose stays clean.
- No headings deeper than `##` and `###`. Most posts only use `##`.

### Structure (typical, not rigid)

A normal post runs ~300–600 words and follows this arc:

1. **Hook** — 1–2 sentence opener stating the problem or the thing being shared.
2. **Why it matters / motivation** — context the reader needs.
3. **How to use it / what it is** — the substance. Use bullets, numbered steps, or a short code block if a command is involved.
4. **Why it's worth it** — short payoff list (3 bullets max).
5. **CTA / wrap-up** — a closing line with the resource link.

Cross-link to prior posts with `[label](/blog/<slug>/)` when relevant — readers and the site love continuity.

### File location & slug

- Path: `src/content/blog/<slug>.md`
- Slug: kebab-case, English. Examples already in repo: `ai-browser-automation.md`, `claude-code-tui-mode.md`, `building-this-site-with-ai.md`.
- Slug is also the URL: `/blog/<slug>/`.

## Step-by-step

### 1. Read the topic from conversation

If the user already explained the topic in their previous message, extract:
- the main subject
- any links they provided
- any "draft" or "release on date X" hints
- whether they want to set it as part of a series (look for callbacks to prior posts)

Only ask follow-up questions if something material is missing.

### 2. Check the existing post inventory

Run a quick `ls src/content/blog/` (or grep for `^date:`) to:
- avoid slug collisions
- find the most recent date if the user is queueing in sequence
- spot prior posts you should link to from the new one

### 3. Pick the slug, title, date, tags

- **Slug** — kebab-case English summary of the topic, 3–6 words.
- **Title** — English title case, short, descriptive. Don't be cute; be clear.
- **Date** — today, unless queueing. Pull `Today's date` from the system reminders.
- **Tags** — reuse existing tags first. Add new ones only if no existing tag fits.

### 4. Write the markdown

- Frontmatter first (per schema above).
- Body in Thai, structured as described.
- Wrap key terms in `**bold**`.
- Use markdown links `[label](url)` for every external reference and every internal cross-link.
- Use fenced code blocks for commands.
- Use a `>` blockquote for callbacks to previous posts at the top, e.g.:
  ```
  > ก่อนหน้านี้ผมเล่าเรื่อง [X](/blog/x/) ไปแล้ว — วันนี้อยาก...
  ```

### 5. Save the file

Write to `src/content/blog/<slug>.md`. Don't create new directories.

### 6. Confirm and offer follow-ups

Report:
- the slug + path
- whether it's draft or live
- the preview URL: `http://localhost:4321/blog/<slug>/`

Then offer (don't auto-run):
- `npm run og` — generate the OG image. Skips drafts automatically.
- `git add … && git commit … && git push origin main` — ship it.

## Examples of the voice (do this)

Hook style:
> "จริง ๆ ผมอยากทำเว็บใหม่มาสักพักแล้วครับ"

Problem framing:
> "ปกติบอก AI ว่า 'ทำ UI ให้สวยหน่อย' — มันก็จะทำ แต่ 'สวย' ในความหมายของ AI กับเรามักไม่ตรงกัน"

Numbered how-to:
> "1. เข้าไปที่ [awesome-design-md] เลือก style ที่อยากได้
> 2. download `design.md` มาวางใน root ของ project
> 3. บอก AI ว่า 'ใช้ `design.md` เป็น reference ทุกครั้งที่ทำ UI'"

Closer:
> "ลองเปิด [link] ดูครับ — น่าจะมีสักตัวที่เข้ากับงานที่ทำอยู่"

## Anti-patterns (don't do this)

- ❌ Translating technical English terms into Thai equivalents (don't write "ทักษะ" for "skill", "หน่วยความจำ" for "memory")
- ❌ Long paragraphs of dense Thai prose — break into bullets and short sections
- ❌ Emojis or decorative Unicode characters
- ❌ Marketing voice ("amazing", "revolutionary", "ที่สุด!!")
- ❌ Headings deeper than `###`
- ❌ Slugs in Thai or with underscores
- ❌ Inventing detail you don't have — if a link, command, or product detail wasn't provided, ask or leave it general rather than fabricating

## Quick reference — frontmatter cheat sheet

```yaml
---
title: "Plain English Title"
summary: "หนึ่งบรรทัดภาษาไทย อธิบายให้ชัด ไม่ขายของ"
date: 2026-05-22
tags: ["ai-coding", "skills"]
draft: true            # only if user asked to queue it
---
```

## Common follow-up requests after creation

| User says | What to do |
|---|---|
| "generate OG" / "make OG image" | Run `npm run og` |
| "commit and push" | `git add` the new `.md` (+ OG png if generated), commit with a 1-line subject, push |
| "preview" / "open it" | Confirm dev server is up (`curl http://localhost:4321/`), give the slug URL |
| "set to draft" / "mark as draft" | Edit the frontmatter to add `draft: true` |
| "release on <date>" | Edit the `date` field; keep `draft: true` until release day |
| "share to facebook" | Hand off to the `fb-post` skill with the post URL |
