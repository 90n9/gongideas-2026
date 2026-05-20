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

ตัวนี้ผมเปิดก่อนเสมอถ้าไม่มีเหตุผลพิเศษ เป็น Chrome extension ของ Anthropic เอง — ติดตั้ง login ครั้งเดียวแล้วใช้เลย

สิ่งที่มัน win คือมัน control Chrome ตัวที่ผม login อยู่จริง ๆ session ของ Gmail, Analytics, Midjourney ที่ค้างไว้ → ใช้ได้เลย ไม่ต้อง re-auth, ไม่ต้องจัดการ cookie อะไรทั้งนั้น

> ถ้าโจทย์คือ "ไปทำอะไรซักอย่างบนเว็บที่ผมล็อกอินอยู่แล้ว" — ตัวนี้คือ default.

ใช้ได้ทั้งจาก Claude Code (CLI) และ Claude.ai บนเว็บ extension เดียวกันเลย

## Playwright MCP

ใช้ตอนต้องการ browser profile แยกต่อ project หรือต้องคุม session หลายตัวพร้อมกัน

เซตอัพใน `.mcp.json` แบบนี้

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

## Playwright CLI + Skill

ใช้ตอน task ใหญ่ที่ MCP กิน token เยอะเกินไป วิธีคือตั้ง skill ให้ Claude รู้ว่าเวลาจะทำ web automation ให้เขียน `.ts` script แล้ว `npx playwright test` รันเอง ไม่ผ่าน MCP เลย

มันกิน token น้อยกว่าเพราะไม่ส่ง DOM snapshot กลับมาทุก step, replay ได้ และ debug ง่ายกว่าเยอะเพราะเห็น script เต็ม ๆ แลกมาด้วย setup ที่นานกว่า และไม่เหมาะงานที่ยังไม่รู้ว่า DOM หน้าตาเป็นยังไง ผมใช้ตัวนี้ตอนรู้ flow ชัดแล้วและต้องรันซ้ำหลายรอบ

## โยนเข้า sub-agent เถอะ

นี่คือบทเรียนแพงที่สุดของผม

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
