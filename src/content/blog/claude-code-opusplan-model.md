---
title: "Claude Code /model opusplan — Opus วางแผน, Sonnet ลงมือ"
summary: "ใช้ opusplan แล้ว Claude Code จะให้ Opus ทำเฉพาะตอน Plan Mode แล้วสลับไปใช้ Sonnet ตอนเขียนโค้ดอัตโนมัติ — ประหยัด quota Opus แบบไม่ต้องสลับ model เอง"
date: 2026-05-28
tags: ["ai-coding", "claude", "claude-code"]
draft: true
---

ถ้าใช้ **Claude Code** แบบ subscription (Pro/Max) จะรู้ดีว่า Opus มี quota แยกจาก Sonnet และหมดเร็วกว่ามาก เพราะแพงกว่าประมาณ 5 เท่า แต่ถ้าใช้ Sonnet ตลอด งานวางแผนยาก ๆ ก็จะคิดไม่ค่อยรอบคอบเท่า

Anthropic เลยใส่ model alias ตัวนึงมาให้ชื่อ **`opusplan`** ที่จัดการให้เองว่าเมื่อไหร่ใช้ Opus เมื่อไหร่ใช้ Sonnet

## วิธีเปิดใช้

พิมพ์ใน Claude Code

```
/model opusplan
```

แค่นี้ก็เสร็จ ตั้งครั้งเดียวจำต่อไปทุก session

## มันทำงานยังไง

`opusplan` ผูกกับ **Plan Mode** ของ Claude Code:

- **อยู่ใน Plan Mode** (กด `Shift+Tab` สลับเข้า, หรือพิมพ์ `/plan`) → ใช้ **Opus** คิดและวางแผน
- **ออกจาก Plan Mode แล้วลงมือทำ** → สลับเป็น **Sonnet** อัตโนมัติเขียนโค้ด, แก้ไฟล์, รัน command

จุดสำคัญคือไม่ต้องสลับ model เอง — Claude Code จัดให้ตาม mode ที่อยู่ในขณะนั้น

## ทำไมถึงประหยัด token

งาน 2 phase นี้ใช้ token ต่างกันมาก

- **Plan phase** — ส่วนใหญ่เป็นการคิด, อ่านไฟล์, ถามตอบกับเรา ปริมาณ token ไม่เยอะแต่ต้องการ reasoning ที่ดี ตรงนี้ Opus คุ้ม
- **Execute phase** — แก้ไฟล์ทีละหลายสิบบรรทัด, รัน tool ซ้ำ ๆ, สร้าง boilerplate ปริมาณ token เยอะมาก แต่ไม่ต้องคิดอะไรซับซ้อน Sonnet เร็วกว่าและถูกกว่า

routing ให้ Opus ทำส่วนสั้นแต่ต้องคิดเยอะ ส่วน Sonnet ทำส่วนยาวแต่ตรงไปตรงมา — ผลคือ quota Opus อยู่ได้นานขึ้นมาก โดยที่คุณภาพการตัดสินใจไม่ตก

## ข้อควรรู้

- **Context window ใน Plan Mode ใช้ 200K ตามปกติ** — ถ้า account เป็น Max/Team/Enterprise แล้วใช้ alias `opus` เฉย ๆ จะได้ 1M context อัตโนมัติ แต่ `opusplan` ตอนเข้า Plan Mode จะไม่ได้ 1M auto-upgrade นี้ ต้อง config เพิ่มถ้าต้องการ
- `opusplan` เป็น **model alias** ไม่ใช่ slash command — set ผ่าน `/model` เหมือน `sonnet`, `opus`, `haiku`
- ใช้ได้ตั้งแต่ Claude Code v2.x เป็นต้นไป (Opus 4.7 ต้อง v2.1.111+)

## เปรียบเทียบกับ Advisor

ก่อนหน้านี้ผมเขียนเรื่อง [Advisor](/blog/claude-code-advisor-tool/) ไป — มันเป็นอีกท่าหนึ่งที่ใช้ Sonnet เป็นหลัก แล้วเรียก Opus มาช่วยตอนงานยาก

ต่างกันตรงนี้

- **Advisor** — Sonnet ทำงานทั้งหมด แล้ว Opus เข้ามา "ที่ปรึกษา" เป็นจุด ๆ ตอน Sonnet ตัดสินใจไม่ลงตัว
- **opusplan** — Opus เป็น "นักวางแผน" ทำทั้ง phase Plan, แล้วส่งต่อ Sonnet ทำ Execute

จะใช้คู่กันก็ได้ — `opusplan` คุม phase, Advisor คอย backup ตอน Sonnet ติด

ถ้าชอบทำงานแบบมี plan ก่อนค่อยลงมือ (ผมแนะนำ) `opusplan` คุ้มมาก ลองสลับมาดู
