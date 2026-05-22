---
title: "Claude Code /tui — Sticky or Scrolling Input"
summary: "เลือกได้ว่าจะให้ช่องพิมพ์ของ Claude Code ปักก้นจอ หรือไหลตาม message"
date: 2026-05-21
tags: ["ai-coding", "claude", "claude-code"]
---

ถ้าใช้ **Claude Code** อยู่ มีคำสั่งเล็ก ๆ ที่ช่วยปรับ UX ของ terminal ให้ถูกจริตขึ้นเยอะคือ `/tui`

มันคือคำสั่งสำหรับสลับ layout ของหน้าจอ — เลือกได้ว่าอยากให้ช่องพิมพ์อยู่ตรงไหนระหว่างทำงาน

## วิธีใช้

พิมพ์ `/tui` เฉย ๆ (ไม่ต้องใส่ argument) เพื่อเช็คว่าตอนนี้ใช้โหมดไหนอยู่ — Claude Code จะบอกกลับมาว่า `Current renderer: fullscreen` หรือ `Current renderer: default` พร้อม usage hint

![/tui แสดง current renderer](/assets/blog-tui-current-renderer.png)

ถ้าอยากสลับ ก็พิมพ์ `/tui default` หรือ `/tui fullscreen` ต่อได้เลย
## สองโหมด

**Fullscreen** — ช่องพิมพ์ปักอยู่ก้นจอตลอดเหมือนแอปแชต ข้อความเก่าไหลขึ้นไปข้างบน แต่ input อยู่ที่เดิมไม่ขยับ จอไม่กะพริบเวลา AI พิมพ์ตอบยาว ๆ เหมาะกับคนที่ชอบ workflow แบบ chat app

![Fullscreen mode](/assets/blog-tui-fullscreen-mode.png)

**Default** — ช่องพิมพ์อยู่ต่อท้าย message ล่าสุด เลื่อนลงไปเรื่อย ๆ ตามที่ AI ตอบ ใช้ scroll ของ terminal ย้อนดูได้ตามปกติ และ copy ข้อความเก่าได้ง่ายกว่า เหมาะกับคนที่อยากอ่าน log แบบ flow ยาว ๆ

![Default mode](/assets/blog-tui-default-mode.png)

## เลือกอันไหนดี

ลองดูเลยว่าชอบแบบไหน

ส่วนตัวผมใช้ Fullscreen เพราะ scroll ขึ้นไปอ่าน output ด้านบนได้สะดวก แล้วกดกลับลงมาต่อได้ทันที — ไม่ต้องหา input box ใหม่ พิมพ์ต่อได้เลยแม้จะเพิ่งเลื่อนขึ้นไปอ่านอะไรอยู่
