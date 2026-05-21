---
title: "ให้ AI ทำงานบน browser ให้"
summary: "สำหรับงานที่ต้องเข้า browser ไปทำเอง หรือต้อง copy ข้อมูลมาให้ AI อีกที — ลองเปลี่ยนให้ AI ทำ web automation เองดีกว่า"
date: 2026-05-03
tags: ["ai-coding", "automation", "claude"]
---

มีงานบางอย่างที่เราทำซ้ำทุกวัน แต่ยังทำเองอยู่เพราะมันไม่มี API หรือ MCP ให้ใช้โดยตรง บางทีก็เพราะ plan ที่เราสมัครไว้มันไม่รวม API บางทีก็เพราะต้องขอสิทธิ์จากคนอื่นก่อนถึงจะเขียน script ได้ เลยไม่คุ้มที่จะไปทำ

อย่างพวก email ก็เป็นตัวอย่างที่ชัด บางคนอยากให้ AI ช่วยกรอง spam หรือ newsletter ออก บางทีก็อยากให้ AI รู้ context ของอีเมลบางฉบับเพื่อจะได้ตอบหรือหาข้อมูลให้ได้ ซึ่งหลายคนก็ใช้วิธี copy เนื้อหาจาก email มาวางใน chat ทีละอัน ซึ่งมันก็ทำได้ แต่เหนื่อย หรืองานพวกเซตอัพ Google Analytics, สร้างไฟล์รูป วิดีโอ เสียง ใน app ที่เราจ่ายตังสมัครไว้ แต่ plan ที่ใช้ไม่มี API ให้ — ก็ต้องเปิดหน้าเว็บเซตเอง แล้วก็วน copy ข้อมูลไปกลับระหว่าง browser กับ terminal ที่คุยกับ AI อยู่

งานพวกนี้จริง ๆ แล้วให้ AI ทำให้ได้ทั้งหมด โดยใช้ browser automation ที่ผมใช้อยู่มีอยู่ 3 แบบ

## Claude in Chrome

ตัวนี้ผมเปิดก่อนเสมอถ้าไม่มีเหตุผลพิเศษ เป็น [Chrome extension ของ Anthropic](https://chromewebstore.google.com/detail/claude/fcoeoabgfenejglbffodgkkbkcdhcgfn) — ติดตั้ง login ครั้งเดียวแล้วใช้เลย

ถ้าต้องการให้ AI เข้า browser ไปทำงานแทนในเว็บที่ต้อง login และเรา login ค้างไว้อยู่แล้ว — ตัวนี้ใช้ได้เลย มัน control Chrome ตัวที่เรา login อยู่จริง ๆ session ของ Gmail, Analytics, Midjourney ที่ค้างไว้ → ใช้ได้เลย ไม่ต้อง re-auth, ไม่ต้องจัดการ cookie อะไรทั้งนั้น

> ถ้าโจทย์คือ "ไปทำอะไรซักอย่างบนเว็บที่ผมล็อกอินอยู่แล้ว" — ตัวนี้คือ default.

เป็น default MCP ที่มีให้ใน Claude อยู่แล้ว ไม่ต้องเซตอัพเพิ่ม ใช้ได้สองทาง: จาก Claude Code (CLI) ผ่าน MCP protocol และจาก side panel ที่ extension สร้างไว้ใน Chrome (ซึ่งก็คือหน้า co-work ใน Claude app นั่นเอง) — ทั้งสองทางเชื่อมผ่าน extension ตัวเดียวกัน

**ข้อจำกัด:** ถ้าต้องการให้ Claude ใช้ Chrome profile อื่นที่ไม่ใช่ profile ที่ login Claude อยู่ จะติดปัญหา — ทางแก้คือเปลี่ยนไปใช้ Playwright แทน

## Playwright MCP

สำหรับคนที่มี Chrome profile หลายตัวแยกกัน เช่น profile งานประจำ กับ profile account ส่วนตัว — ตัวนี้ช่วยได้ เราสามารถระบุได้เลยว่าอยากให้ AI ใช้ browser profile ไหน โดยสร้างไฟล์ `.mcp.json` ไว้ใน folder ที่เราจะรัน `claude` command

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest", "--user-data-dir=/Users/me/projects/foo/.playwright-mcp"]
    }
  }
}
```

`--user-data-dir` คือตัวสำคัญ — login ทิ้งไว้ใน path นี้รอบเดียว รอบหน้าเปิดมา session ยังอยู่ครบ จะแยก dir ต่อ project ก็ได้ ไม่ต้อง logout/login ซ้ำทุกครั้ง

สำหรับผมแล้ว Claude in Chrome ใช้ตอนที่ต้องการ browse ผ่าน profile งานประจำที่ login ค้างไว้อยู่แล้ว ส่วน Playwright MCP จะใช้ตอนต้องการ profile account ส่วนตัว หรือตอนที่ Claude in Chrome ติดปัญหา หรืออยากได้ browser แยก session มาเทสอะไรบางอย่าง

## Playwright CLI + Skill

ใช้ตอน task ใหญ่ที่ MCP กิน token เยอะเกินไป วิธีคือใช้ [Playwright CLI](https://github.com/microsoft/playwright-cli) ผ่าน skill แทน ไม่ผ่าน MCP เลย — CLI ไม่โหลด tool schema และ DOM snapshot เข้า context ทำให้กิน token น้อยกว่าเยอะ

ติดตั้งด้วย

```bash
npm install -g @playwright/cli@latest
playwright-cli install --skills
```

คำสั่งที่สองคือสิ่งสำคัญ — มันจะ install skill ไว้ให้ Claude Code (หรือ coding agent ตัวอื่น) รู้เองว่าเวลาทำ web automation ให้เรียก `playwright-cli` แทน เราไม่ต้องเขียน skill เอง

ถ้าอยากระบุ browser profile หรือ option อื่น ๆ ต่อ project วาง config ไว้ที่ `.playwright/cli.config.json` แล้ว CLI จะ load auto ไม่ต้องพิมพ์ flag ซ้ำทุกครั้ง

```json
{
  "browser": {
    "userDataDir": "/Users/me/.chrome-profiles/personal",
    "launchOptions": { "channel": "chrome", "headless": false }
  }
}
```

login รอบเดียวใน path นั้น รอบหน้าเปิดมา session ยังอยู่ครบ ไม่ต้อง auth ซ้ำ

เวลาสั่งงาน Claude จะเขียน CLI command ต่อ step (เช่น `playwright-cli open`, `click`, `type`, `snapshot`) แทนการ round-trip DOM ผ่าน MCP มันกิน token น้อยกว่าเยอะ, replay ได้ และ debug ง่ายเพราะเห็น command เต็ม ๆ แลกมาด้วย setup ที่นานกว่านิดหน่อย ผมใช้ตัวนี้ตอนรู้ flow ชัดแล้วและต้องรันซ้ำหลายรอบ

## โยนเข้า sub-agent เถอะ

Web automation กิน token หนักมาก ทุก step มันส่ง DOM กับ screenshot กลับมา ถ้าให้ main context ทำเอง context window เต็มใน 5–10 step แล้ว Claude เริ่มลืม goal เดิม

วิธีแก้คือ spawn sub-agent ออกไปทำงานแทน

```
Task: triage gmail
→ spawn sub-agent
   → sub-agent คุย MCP, browse, ทำงาน
   → return short summary กลับมา
→ main context รับแค่ "archived 23, replied 4"
```

Main context ไม่เห็น DOM สักก้อน — clean มาก

และถ้ามี API หรือ MCP ตรง ๆ อยู่แล้วอย่าง Gmail, Slack, Datadog — ใช้ตัวนั้นก่อนเลย Browser automation ไว้ใช้ตอนไม่มี API ให้เรียก ไม่ใช่ default tool

## สรุป

| สถานการณ์ | ใช้อะไร |
|---|---|
| งาน routine บนเว็บที่ login อยู่ | Claude in Chrome |
| ต้อง persist profile ต่อ project | Playwright MCP + `--user-data-dir` |
| งานทำซ้ำหลายรอบ รู้ flow ชัด | Playwright CLI + skill |
| มี MCP/API อย่างเป็นทางการ | ใช้ตัวนั้น — ไม่ใช่ browser |

หวังว่าจะเป็นประโยชน์ต่อทุกคนนะครับ
