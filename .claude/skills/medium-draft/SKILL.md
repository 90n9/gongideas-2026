---
name: medium-draft
description: Create a new draft story on Medium using Playwright browser automation. Use this skill whenever the user says "post to medium", "add to medium", "create medium draft", "medium-draft", or wants to save a blog post / article to Medium as a draft. The skill navigates to medium.com/new-story, pastes the title and body text, and leaves it as a saved draft. Text only — no images, no publishing.
---

# medium-draft — Create a Draft on Medium

Creates a new saved draft on Medium at `https://medium.com/new-story` with a title and body text.

## What you need from the user

- **Title** (required) — the story title
- **Body** (required) — the full body text (plain text; headings and bold can be applied manually later)

If neither is provided, ask before proceeding.

## Step-by-step

### 1. Load Playwright tools

Before any browser action, load the required tools:

```
ToolSearch: select:mcp__playwright__browser_navigate,mcp__playwright__browser_evaluate,mcp__playwright__browser_press_key,mcp__playwright__browser_click,mcp__playwright__browser_snapshot,mcp__playwright__browser_take_screenshot
```

### 2. Navigate to new story

```
mcp__playwright__browser_navigate
url: https://medium.com/new-story
```

If a "beforeunload" dialog appears, accept it. Take a snapshot to confirm the editor loaded (you should see a `textbox` element in the article).

### 3. Paste the title

Medium uses Draft.js under the hood. Draft.js ignores DOM-level `fill()` and `setValue()` — only real keyboard input and native paste events update the editor state. Always use clipboard paste, never `browser_type` without `slowly: true` or `fill()`.

Write the title to clipboard:

```js
// via mcp__playwright__browser_evaluate
() => navigator.clipboard.writeText('<title>').then(() => 'done')
```

Click the title textbox (first textbox in the article), then paste:

```js
// find and click title field
() => {
  const box = document.querySelector('article textbox, [data-testid="editorParagraphText"]');
  if (box) { box.click(); return 'clicked'; }
  return 'not found';
}
```

Or use `mcp__playwright__browser_click` with the snapshot ref for the active textbox.

Then press paste:
```
mcp__playwright__browser_press_key  key: Meta+v
```

Wait ~500ms and take a snapshot to confirm the title appeared.

### 4. Press Enter to move to body

```
mcp__playwright__browser_press_key  key: Enter
```

After pressing Enter, Draft.js automatically places the cursor in the first body paragraph. **Do not click anywhere** — the cursor is already where it needs to be.

### 5. Paste the body

Write the full body text to clipboard:

```js
() => navigator.clipboard.writeText(`<body text>`).then(() => 'done')
```

Then immediately paste — no extra clicks:

```
mcp__playwright__browser_press_key  key: Meta+v
```

Wait ~2 seconds for Medium to autosave:

```js
() => new Promise(resolve => setTimeout(resolve, 2000))
```

### 6. Confirm saved

Take a screenshot. The header should show "Draft · Saved". Report success to the user with the draft URL (shown in the browser address bar as `https://medium.com/p/<id>/edit`).

## If something goes wrong

| Symptom | Cause | Fix |
|---------|-------|-----|
| "Something is wrong and we cannot save your story" | `fill()` or `browser_type` without `slowly:true` was used instead of clipboard paste | Reload the page, use clipboard+paste approach |
| Title and body text merged into the title field | Body was pasted while cursor was still in the title | Press Cmd+A, write just the title to clipboard, paste to replace, press Enter, then paste body |
| Editor shows 503 error | Medium transient error | Wait 3s and navigate again |
| "Publishing will become available after you start writing" | Body paste didn't register | Re-focus body: find `.graf--p` after the title and click it, then paste again |
| beforeunload dialog blocking navigation | Previous draft had unsaved changes | Accept the dialog via `mcp__playwright__browser_handle_dialog accept: true` |

## Notes

- This skill saves a **draft only** — it does not publish
- Heading formatting (H2/H3) and bold should be applied manually in the Medium editor after the draft is saved
- Image uploads must be done manually
- The user must already be logged in to Medium in the Playwright browser profile
