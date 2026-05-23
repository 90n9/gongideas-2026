---
name: fb-post
description: Post content to the GongIdeas Facebook page using Playwright browser automation. Use this skill whenever the user says "fb-post", "post to facebook", "share to facebook", "share to the page", "โพสต์ facebook", or wants to publish a blog post / announcement / idea project to the GongIdeas Facebook page. For blog shares the skill posts the full article body (markdown stripped) and then leaves the GongIdeas site URL in the first comment as a "find more here" pointer — keeping readers on Facebook for the article itself while opening a discovery path. For ideas/project shares it posts the message with the project URL in the body. Post text must be plain text only — no emoji or icons.
---

# fb-post — Post to GongIdeas Facebook Page

Posts to the GongIdeas Facebook page at:
`https://www.facebook.com/profile.php?id=61583997504846`

## Two posting modes — pick the right one

Facebook caps the GongIdeas page at **4 posts with links per month**. To stay under the cap AND give FB readers value without forcing them off-platform, this skill posts blog content **directly in the post body** and uses the first comment to point to the GongIdeas site for further discovery.

### Mode A — `full-content` (default for **blog post** shares)

- **Post body**: the entire blog article, with markdown stripped (no `**bold**`, no `[label](url)`, no `>` blockquotes, no fenced code). Plain Thai/English text only.
- **First comment**: the GongIdeas site URL, framed as a "find more posts here" pointer — `https://gongideas.com/blog/` (the index, not the specific article).
- Reason: Facebook's feed algorithm rewards on-platform content. By posting the full article inline, readers see the whole thing in the feed; the comment URL is a discovery handle for new visitors, not the click-through target.

**Use this mode whenever the share is for a `/blog/` post.**

### Mode B — `link-in-body` (use for **ideas project** shares and other low-volume shares)

- **Post body**: message + project URL on its own line (Facebook renders a preview card in the post itself).
- No follow-up comment needed.
- This consumes one of the 4 monthly link slots — reserve it for project launches under `/ideas/` where the in-feed preview card actually matters.

**Use this mode for `/ideas/` project shares and other one-off announcements.**

If the user doesn't say which mode, infer from the URL/topic: blog post → Mode A; ideas project → Mode B. Confirm if it's ambiguous.

## What you need from the user

For **Mode A** (default for blogs):
- **Slug or markdown file path** (preferred) — the skill reads `src/content/blog/<slug>.md` and strips it into plain text automatically.
- Or a pre-written **message body** if the user wants to customize the share text.

For **Mode B**:
- **Message** (required) — plain-text body, no emoji.
- **URL** (required) — the project URL to embed in the post.

If neither slug nor message is provided, ask.

## Step-by-step

### 1. Load Playwright tools

```
ToolSearch: select:mcp__playwright__browser_navigate,mcp__playwright__browser_snapshot,mcp__playwright__browser_evaluate,mcp__playwright__browser_type,mcp__playwright__browser_press_key,mcp__playwright__browser_take_screenshot
```

### 2. (Mode A only) Build the post body from the markdown file

Read `src/content/blog/<slug>.md` and strip it into plain text. Apply these conversions in order:

1. **Remove frontmatter** — drop everything between the first `---` and the next `---`.
2. **Headings** — strip leading `#`, `##`, `###` markers. Keep the heading text on its own line.
3. **Bold/italic** — replace `**text**` and `*text*` with just `text`.
4. **Links** — replace `[label](url)` with just `label`. Don't keep the URL inline — that defeats the purpose of Mode A.
5. **Blockquotes** — strip leading `> `.
6. **Lists** — keep `-` / `*` / `1.` markers as-is (Facebook renders them fine in plain text).
7. **Fenced code blocks** — drop the ``` fences; keep the inner code (or summarize if it's long).
8. **Inline code** — strip the backticks; keep the text.
9. **Horizontal rules** (`---`) — drop them.
10. **Trim** — collapse 3+ blank lines to 2; trim leading/trailing whitespace.
11. **Append follow CTA** — add one blank line, then the follow prompt as the last line of the body:

    ```
    กดติดตามเพจไว้ จะได้ไม่พลาดบทความและเทคนิคใหม่ ๆ ครับ
    ```

    (Wording can be lightly adjusted to match the post's tone, but always end with `ครับ` and reference following the page for more content. Don't use emoji.)

The resulting plain text is the post body. **Do not include any URLs in the body** — the article URL goes in the comment, and the site URL goes in the comment.

If the post body comes out longer than ~5000 characters, ask the user whether to trim or post the full thing (FB technically allows up to ~63k chars, but engagement drops sharply on very long posts).

### 3. Navigate to the page

```
mcp__playwright__browser_navigate
url: https://www.facebook.com/profile.php?id=61583997504846
```

### 4. Open the post composer

Direct selectors for Thai text are unreliable — use JS evaluate to find the button by text:

```js
() => {
  const btns = Array.from(document.querySelectorAll('[role="button"]'));
  const btn = btns.find(b => b.textContent.includes('คุณกำลังคิดอะไรอยู่'));
  if (btn) { btn.click(); return 'clicked'; }
  return 'not found';
}
```

If result is `"not found"`, take a snapshot — the user may need to log in.

### 5. Type the post body

The composer textbox has `aria-placeholder="คุณกำลังคิดอะไรอยู่"`. Use `mcp__playwright__browser_type`:

**Mode A:** type the full stripped article body. No URLs.

```
target: [aria-placeholder="คุณกำลังคิดอะไรอยู่"]
text: <stripped article body>
```

**Mode B:** type message + follow CTA + URL on its own line:

```
target: [aria-placeholder="คุณกำลังคิดอะไรอยู่"]
text: <message>
      
      กดติดตามเพจไว้ จะได้ไม่พลาดบทความและเทคนิคใหม่ ๆ ครับ
      
      <URL>
```

**Important:** Plain Thai/English only. Strip emoji (🔥, 🚀, etc.) and special Unicode (◆, ★, etc.) before typing — even if the source markdown contains them.

### 6. Wait briefly

```js
() => new Promise(resolve => setTimeout(resolve, 2500))
```

### 7. If a link preview card got attached (Mode A only), remove it

Even when no URL was typed, FB sometimes auto-attaches a preview from cached state (e.g. a previous session's URL). Check and remove:

```js
() => {
  const dialog = document.querySelector('[role="dialog"][aria-label="สร้างโพสต์"]');
  if (!dialog) return 'no composer';
  const btn = Array.from(dialog.querySelectorAll('[role="button"]'))
    .find(b => b.getAttribute('aria-label') === 'ลบพรีวิวลิงก์ออกจากโพสต์ของคุณ');
  if (btn) { btn.click(); return 'removed preview'; }
  return 'no preview';
}
```

### 8. Click "ถัดไป" (Next)

```js
() => {
  const btns = Array.from(document.querySelectorAll('[role="button"], button'));
  const btn = btns.find(b => b.textContent.trim() === 'ถัดไป');
  if (btn) { btn.click(); return 'clicked'; }
  return 'not found';
}
```

If a rate-limit dialog appears (text starts with `"ลบลิงก์ของคุณเพื่อโพสต์ต่อให้เสร็จ"`), Mode A should have prevented it. If it shows up anyway, either remove the lingering preview card (step 7) and retry, or fall through to manual posting.

### 9. Click "โพสต์" (Post)

```js
() => {
  const btns = Array.from(document.querySelectorAll('[role="button"], button'));
  const btn = btns.find(b => b.textContent.trim() === 'โพสต์');
  if (btn) { btn.click(); return 'posted'; }
  return 'not found';
}
```

### 10. Wait, then verify the post landed in the feed

```js
() => new Promise(resolve => setTimeout(resolve, 4000))
```

Navigate back to the page URL to refresh and verify:

```js
() => {
  const articles = Array.from(document.querySelectorAll('[role="article"]'));
  // Look for an article whose text contains a unique snippet from the just-posted body.
  const found = articles.find(a => a.innerText.includes(SNIPPET));
  return found ? 'found' : 'NOT FOUND — silent drop';
}
```

If the post is **not** in the feed within ~10 seconds, Facebook silently dropped it. Report this honestly to the user and offer:
- retry after a short cool-down (~30 min),
- post manually (copy the body to clipboard via `pbcopy`),
- switch to Medium via the `medium-draft` skill.

### 11. (Mode A only) Add the GongIdeas site URL as the first comment

The comment is a **discovery handle**, not the article link. Always point to the site index, never to the specific article — that way one comment template works for every blog share.

#### 11a. Open the comment composer on the new post

```js
() => {
  const articles = Array.from(document.querySelectorAll('[role="article"]'));
  // Target the article that contains a unique snippet from this post's body.
  const post = articles.find(a => a.innerText.includes(SNIPPET));
  if (!post) return 'post not found';
  const btn = Array.from(post.querySelectorAll('[role="button"]'))
    .find(b => b.textContent.trim() === 'ความเห็น');
  if (btn) { btn.click(); return 'opened'; }
  return 'no comment button';
}
```

#### 11b. Type the comment text

Default comment template (Thai):

```
อ่านบทความอื่น ๆ ของ GongIdeas ได้ที่ https://gongideas.com/blog/
```

```
target: [aria-placeholder^="เขียนความเห็น"]
text: อ่านบทความอื่น ๆ ของ GongIdeas ได้ที่ https://gongideas.com/blog/
```

#### 11c. Wait and submit with Enter

```js
() => new Promise(resolve => setTimeout(resolve, 1500))
```

Then `mcp__playwright__browser_press_key` with `key: "Enter"`.

### 12. Confirm

Take a screenshot:

```
mcp__playwright__browser_take_screenshot
filename: fb-post-confirm.png
```

Report success to the user, including:
- mode used
- post body length (Mode A) or URL (Mode B)
- whether the discovery comment was added

## When automation fails (silent drop)

The Playwright path can silently fail — composer closes, no error, no post in feed. Causes seen:
- Page got throttled after a recent rate-limit hit.
- Post text matched an anti-spam heuristic (e.g. phrases like "link in comments" can flag posts).
- Cached link preview re-attached without the URL being visible.

**Fallback:** copy the post body and the comment URL to the clipboard with `pbcopy`, and ask the user to publish manually. Manual posting almost always works when automation doesn't.

```bash
# In a Bash tool call:
cat <<'EOF' | pbcopy
<post body>
EOF
```

Then for the comment:

```bash
printf 'https://gongideas.com/blog/' | pbcopy
```

## Common issues

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| Composer not found | Not logged in | Ask user to log in first |
| "ถัดไป" button doesn't advance | Lingering link preview card | Run step 7's remove-preview snippet |
| "ลบลิงก์ของคุณ..." sub-dialog appears | Hit 4-link/month cap (Mode B) or stale preview | Close sub-dialog, remove preview card, retry |
| Post not in feed after publish | Silent drop / throttle | Wait 30 min, or fall back to manual posting via clipboard |
| Comment button not found | Post hasn't rendered yet | Wait another 2s and retry the article query |

## Why Mode A defaults to full-content + discovery comment

Facebook's organic reach favors posts that keep users on the platform. Pulling readers off to a blog tanks reach. By posting the full article in the body, the FB post becomes the destination — readers consume the article without leaving the feed. The discovery comment (site index, not the specific article) is a "where else can I find this kind of thing" handle for new followers, not a hard call-to-action. This sidesteps the 4-link-posts-per-month cap entirely (no link in the body) while still giving curious readers a path to gongideas.com.
