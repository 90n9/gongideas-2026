---
title: "Web Automation บน Claude Code"
summary: "Claude in Chrome, Playwright MCP, และ Playwright CLI — เลือกใช้ตัวไหนตอนไหน, และทำไมต้องโยนเข้า sub-agent ก่อนเสมอ"
date: 2026-05-03
tags: ["ai-coding", "automation", "claude"]
---

ปัญหาที่อยากแก้: งานเว็บซ้ำ ๆ ทุกวันมันกินเวลาผมไปเยอะเกิน.

เปิด Gmail มา triage 50+ เมล. เปิด Google Analytics ไปเซตอัพ property ใหม่ทุกครั้งที่ขึ้น project. เปิด Midjourney แปะ prompt รอภาพ, แล้ว switch tab ไป ElevenLabs gen เสียง. งานพวกนี้ไม่ต้องคิด แต่กินเวลาวันละชั่วโมง+ ง่าย ๆ.

คำถามคือ — ถ้าผมให้ Claude Code นั่งทำแทน, มันทำได้แค่ไหน?

คำตอบ: ทำได้เกือบทั้งหมด ถ้าเลือกเครื่องมือถูก.

ผมใช้ web automation บน Claude Code มาประมาณ 3 เดือนแล้ว ทั้งใน routine ส่วนตัวและงาน client. มี 3 วิธีที่ผมหมุนใช้, แต่ละตัวมีจังหวะของมัน. โพสต์นี้คือ cheat sheet ของตัวเอง — เผื่อใครอยากเริ่มจะได้ไม่ต้องลองผิดถูกเหมือนผม.

## วิธีที่ 1: Claude in Chrome (MCP)

ตัวที่ผมใช้บ่อยที่สุด. เป็น **Chrome extension** ที่ Anthropic ทำเอง — ติดตั้ง, login เข้า extension ครั้งเดียว, เสร็จ.

จุดที่มัน win คือ: **มัน control Chrome ตัวที่ผม login อยู่**. แปลว่า session ของ Gmail, Google Analytics, Midjourney ที่ผม login ไว้แล้ว → ใช้ได้เลย ไม่ต้อง re-auth, ไม่ต้องจัดการ cookie.

> ถ้าโจทย์คือ "เปิดเว็บที่ผมล็อกอินอยู่แล้ว ไปทำอะไรซักอย่าง" — Claude in Chrome คือคำตอบ default ของผม.

เซตอัพแบบ end-to-end ใช้เวลา ~5 นาที. และตัวนี้มันทำงานได้ทั้งกับ **Claude Code (CLI)** และตอนเปิด session คู่กับ **Claude.ai บนเว็บ** — อันเดียวกัน, ใช้ extension เดียวกัน.

งานที่ผมโยนใส่บ่อย:
- Triage Gmail ตอนเช้า — label, archive, ร่าง reply
- เปิด Midjourney → แปะ prompt → รอ → save image กลับ local
- ElevenLabs gen voice-over จาก script ที่ผมเขียน
- เซตอัพ GA4 property ใหม่ตอนขึ้น project

## วิธีที่ 2: Playwright MCP

ใช้ตอน Claude in Chrome ไม่เหมาะ — เช่น ต้องรันใน background, ต้องคุม browser หลายตัว, หรือต้องการ profile แยกต่อ project.

เซตอัพใน `.mcp.json`:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest",
        "--user-data-dir=/Users/me/projects/foo/.playwright-mcp"
      ]
    }
  }
}
```

`--user-data-dir` คือ **กุญแจ**. มันคือ Chrome profile directory ของ Playwright ตัวนั้น. ถ้าผมล็อกอิน Google Account ทิ้งไว้รอบเดียวใน path นี้, รอบหน้าเปิดมา → ยังล็อกอินอยู่. และผมแยก dir ต่อ project ได้:

- `~/projects/foo/.playwright-mcp` → account A (project A)
- `~/projects/bar/.playwright-mcp` → account B (project B)

อยากสลับ? แค่แก้ path ใน `.mcp.json`. ไม่ต้อง logout/login ทุกครั้ง.

> ของแถม: ถ้าใช้ **Codex CLI** ของ OpenAI, config เหมือนกันเป๊ะ — แค่เขียนเป็น TOML แทน JSON ที่ `~/.codex/config.toml`. ผมเอา snippet เดียวกันใช้ทั้งสองที่.

## วิธีที่ 3: Playwright CLI + Skill

อันนี้ผมเพิ่งย้ายมาใช้ตอน task ใหญ่ ๆ ที่ MCP กิน token เยอะเกิน.

วิธีคือ: install `playwright` CLI ตรง ๆ, แล้วเซต **skill** (ไฟล์ `SKILL.md` ใน skill folder) ที่บอก Claude ว่า — เวลาจะทำ web automation, ให้เขียน Playwright script เป็น `.ts` แล้ว `npx playwright test` รันเอา. ไม่ผ่าน MCP เลย.

ข้อดีที่ skill เคลม (และผมก็เห็นด้วย หลังลอง):
- **กิน token น้อยกว่า MCP** — เพราะ MCP ส่ง DOM snapshot กลับมาทุก step. CLI mode มันไม่ส่ง, แค่ดู script รันผ่าน/ไม่ผ่าน
- **Replay ได้** — script เซฟเป็นไฟล์, รันซ้ำได้โดยไม่ต้องเรียก Claude เลย
- **Debug ง่ายกว่า** — เห็น script เต็ม ๆ, รู้เลยว่ามันคลิก selector ไหน

trade-off: setup นานกว่า, และไม่เหมาะกับงานสำรวจ (ที่ไม่รู้ว่าหน้าตา DOM เป็นยังไง). ใช้ตอนรู้แน่ ๆ ว่าจะทำอะไร, ทำซ้ำหลายรอบ.

## เรื่องสำคัญที่อยากเตือน — โยนเข้า sub-agent เถอะ

นี่คือบทเรียนแพง ๆ ของผม.

Web automation **กิน token หนักมาก** — ทุก step มันโยน DOM/screenshot/accessibility tree กลับมา. ถ้าให้ main context ทำเอง, context window เต็มภายใน 5–10 step. แล้ว Claude เริ่มลืม goal เดิม.

วิธีแก้: **โยนเข้า sub-agent**.

```
Task: triage gmail
→ spawn sub-agent (subagent_type=general-purpose)
   → sub-agent คุย MCP, browse, ทำงาน
   → return short summary กลับมา
→ main context รับแค่ "done, archived 23, replied 4"
```

Main context ไม่เห็น DOM สักก้อน. clean.

อีกข้อ — **ถ้ามี API หรือ MCP ตรง ๆ, ใช้ตัวนั้นก่อน**. อย่าไปไล่คลิก browser. ตัวอย่าง:
- Gmail → ใช้ Gmail MCP / API
- Slack → ใช้ Slack MCP
- Datadog → ใช้ Datadog MCP

Browser automation = **last resort** เวลาไม่มี API ให้เรียก. ไม่ใช่ default tool.

## สรุปแบบที่ผมใช้จริง

| สถานการณ์ | ใช้อะไร |
|---|---|
| งาน routine บนเว็บที่ผม login อยู่ | Claude in Chrome |
| ต้อง persist profile ต่อ project | Playwright MCP + `--user-data-dir` |
| งานทำซ้ำหลายรอบ, รู้ flow ชัด | Playwright CLI + skill |
| มี MCP/API อย่างเป็นทางการ | **ใช้ตัวนั้น, ไม่ใช่ browser** |

3 เดือนที่ผ่านมา routine ตอนเช้าผมหายไปประมาณ 45 นาที/วัน. ส่วนนึงเอาคืนมาเขียน devlog แบบนี้แหละ.
