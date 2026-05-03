---
title: "PICO-8 Weekend Game"
ideaId: "004"
summary: "เกม platformer ที่ทำเสร็จใน 48 ชั่วโมง — เรียนจาก scratch, ship แบบ rough but real"
category: "game-dev"
status: "shipped"
difficulty: 2
date: 2026-03-10
tools: ["PICO-8", "Lua"]
reads: 22
cover: "COVER · TBD"
---

## Brief

48 ชั่วโมง. ไม่เคยใช้ PICO-8 มาก่อน. ผลลัพธ์ต้องเล่นได้จริงในเบราว์เซอร์.

## Day 1 — Learn the constraints

PICO-8 มี:
- 128×128 px screen
- 16 colors
- 8KB cart limit
- 4-channel sound

ข้อจำกัดพวกนี้ดูโหด แต่จริง ๆ มันคือสิ่งที่ทำให้จบโปรเจกต์ได้. ไม่มี option ให้ over-engineer.

## Day 2 — Ship

- ตัวละคร: ลูกบอลเด้ง
- 4 stages
- Title screen + ending
- Music: 30 วินาที loop ด้วย built-in tracker

```lua
function _update()
  if btn(0) then p.dx -= 0.2 end
  if btn(1) then p.dx += 0.2 end
  if btnp(4) and p.grounded then p.dy = -4 end
  apply_physics(p)
end
```

## Lessons

- **Time-boxed dev คือ mood booster**. ไม่ต้องสมบูรณ์แบบ. แค่จบ
- การเรียน language ใหม่ผ่าน project จริง ๆ เร็วกว่าอ่าน docs สามเท่า
- PICO-8 sound editor ทำให้ผมเข้าใจ chiptune ลึกขึ้นเยอะ — recommend ลองเล่นเล่น ๆ ดู
