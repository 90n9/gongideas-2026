---
title: "เริ่มต้น Game Dev บน PICO-8 ใน 7 วัน"
summary: "Diary 7 วันของการเรียน PICO-8 แบบ from scratch จนเล่นเกมเองได้ — Lua, sprite editor, sound tracker, all of it"
date: 2026-04-18
tags: ["game-dev"]
relatedIdea: "pico8-weekend"
---

ผมไม่เคยทำเกมมาก่อน. เคยอยากทำ. ทุกครั้งจะเปิด Unity แล้วยอมแพ้ภายใน 2 ชม. เพราะรู้สึกว่ามันใหญ่เกินไป.

PICO-8 พลิกความรู้สึกนั้นในวันแรก.

## Day 1 — Setup + Hello World

ดาวน์โหลด PICO-8 ($15), เปิด, พิมพ์:

```lua
function _draw()
  cls()
  print("hello bulby", 40, 60, 7)
end
```

`run`. มี text บนหน้าจอ. นี่แหละ. แค่นี้.

## Day 2 — Sprite editor

PICO-8 มี sprite editor ในตัว. 16 colors. กด `esc` เพื่อ toggle ระหว่าง code/sprite editor. วาด Bulby ตัวเล็ก ๆ ใช้เวลา 20 นาที.

## Day 3 — Movement + collision

```lua
p = { x=64, y=64, dx=0, dy=0 }

function _update()
  if btn(0) then p.x -= 1 end
  if btn(1) then p.x += 1 end
  if btn(2) then p.y -= 1 end
  if btn(3) then p.y += 1 end
end
```

โง่ แต่ทำงาน. ค่อย ๆ เพิ่ม gravity, jump, ground collision.

## Day 4 — Map editor

PICO-8 มี tilemap editor 128×32 tiles. วาดด่านแรก. รู้สึกเหมือนเด็ก 10 ขวบกำลังทำการบ้านที่สนุกที่สุดในชีวิต.

## Day 5 — Sound + music

Sound tracker ใน PICO-8 เป็นระดับ "PhD ใน 3 ชม." — ต้องอ่าน manual + ดู YouTube. แต่พอเข้าใจ 4-channel structure แล้ว, การแต่งเพลง 30-วิ-loop กลายเป็น addictive.

## Day 6 — Bug fixing + ending screen

ครึ่งวันหมดไปกับ bug ที่ player พุ่งทะลุพื้นเวลากระโดดติดมุม. แก้ด้วย "step in axis order: x first, then y" — classic platformer trick.

## Day 7 — Ship

Export เป็น HTML cart. Upload ไป itch.io. เกมจริง ๆ. 4 stages, title screen, ending. รวม 8KB.

## ทำไม PICO-8 ดี

> **Constraint = creativity**. คุณไม่ต้อง agonize over feature scope. ถ้ามันใส่ใน 8KB ไม่ได้, มันออก.

Unity ผมยังไม่กลับไป. ตอนนี้ planning เกมตัวที่ 2 บน PICO-8 — bullet hell แบบ minimal. ไว้เขียน devlog เพิ่ม.
