---
title: "Claude Code Sub-agent Squad"
ideaId: "001"
summary: "ทีมเอเจนต์ทำงานพร้อมกันใน workflow เดียว — ลด context-switch ระหว่าง task ใหญ่ ๆ ของ codebase"
category: "ai-coding"
status: "shipped"
difficulty: 3
date: 2026-04-18
tools: ["Claude Code", "TypeScript", "Bash", "tmux"]
reads: 47
cover: "COVER · TBD"
---

## Why this quest

ผมพยายามใช้ Claude Code คนเดียวจัดการ codebase ใหญ่ ๆ ที่ต้องอ่านไฟล์เป็นสิบ ๆ ก่อนแก้บั๊ก แต่บ่อยครั้งที่ context-window มันโดนกินไปกับการสำรวจมากกว่าการแก้ไขจริง ๆ. สิ่งที่ขาดคือ **separation of concerns** ระดับเอเจนต์ — agent หนึ่งสำรวจ, อีกตัวแก้, อีกตัวรีวิว.

> "If a senior dev would split this work across three people, your AI workflow should split it across three agents."

## ผลลัพธ์

- ลดเวลา debug บั๊ก cross-cutting จาก ~45 นาที เหลือ ~15 นาที
- Main context หลักไม่บวมเพราะการ exploration ถูก offload ไปที่ Explore agent
- เริ่มใช้ pattern นี้ใน 3 client projects แล้ว

## วิธีทำ

แบ่งเป็น 3 agent profiles:

1. **Scout** — ค้นไฟล์ + อ่าน excerpt, ห้ามแก้ไข
2. **Surgeon** — รับ context จาก Scout, แก้ไขตรงจุด
3. **Reviewer** — independent reviewer ที่ไม่เห็น Surgeon's reasoning

```bash
# spawn pattern (simplified)
agents/scout.sh "find all callers of processOrder()"
agents/surgeon.sh "apply fix from scout output"
agents/reviewer.sh "review surgeon diff for regressions"
```

## What's next

อยาก experiment กับการให้ agent ทั้งสามคุยกันแบบ async ผ่าน shared scratchpad แทนการรันแบบ sequential — น่าจะลด end-to-end latency ได้อีก.
