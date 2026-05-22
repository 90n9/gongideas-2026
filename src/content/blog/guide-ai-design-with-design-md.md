---
title: "Guide AI Design With a design.md File"
summary: "อีกวิธีคุมหน้าตางาน design ของ AI — โหลด design.md จากเว็บดัง ๆ มาวางในโปรเจกต์ แล้วบอก AI ให้อ้างอิงตัวนี้ทุกครั้ง ทั้งโปรเจกต์เลยมี style เดียวกัน"
date: 2026-05-26
tags: ["ai-coding", "design"]
draft: true
---

ก่อนหน้านี้ผมเล่าเรื่อง [Huashu Design skill](/blog/building-this-site-with-ai/) ที่ใช้ทำเว็บนี้ไปแล้ว — วันนี้อยากแชร์อีกวิธีในการคุม design ของ AI ให้ออกมาดี

## ปัญหา

ปกติบอก AI ว่า "ทำ UI ให้สวยหน่อย" — มันก็จะทำ แต่ "สวย" ในความหมายของ AI กับเรามักไม่ตรงกัน และที่แย่กว่าคือ — สั่งครั้งที่ 1 ได้แบบหนึ่ง สั่งครั้งที่ 2 ได้อีกแบบหนึ่ง ทั้งโปรเจกต์เลย **inconsistent**

## วิธีแก้ — ใช้ design.md เป็นไกด์

มีคนทำ repo รวม "**design.md**" จากเว็บไซต์ดัง ๆ ไว้ให้แล้ว ชื่อ [**awesome-design-md**](https://github.com/voltagent/awesome-design-md)

แต่ละไฟล์อธิบายเป็น text ว่าเว็บนั้น ๆ ใช้:

- color palette แบบไหน
- font อะไร, ขนาดเท่าไร
- spacing scale, border radius
- component style (button, card, modal)
- pattern โดยรวม (minimal, brutalist, glassmorphism ฯลฯ)

## วิธีใช้

1. เข้าไปที่ [awesome-design-md](https://github.com/voltagent/awesome-design-md) เลือก style ของเว็บที่อยากได้
2. download ไฟล์ `design.md` ตัวนั้นมาวางใน root ของ project
3. บอก AI ว่า "ใช้ `design.md` เป็น reference ทุกครั้งที่ทำ UI"

แค่นี้ — ทุกหน้าจะออกมา style เดียวกัน ไม่ว่าจะให้ AI ทำกี่ครั้ง

## ทำไมถึงเวิร์ก

เพราะ AI ไม่ต้องเดาแล้วว่า "สวย" หมายถึงอะไร — มันอ่าน spec ออกมาทำตามเลย และเพราะเป็น text file ธรรมดา เราอ่านได้, แก้ได้, version control ได้

## เหมาะกับใคร

- programmer ที่ไม่มีพื้น design — โหลดของคนอื่นมาใช้ก่อน
- คนที่อยากให้ทั้งโปรเจกต์มี style เดียวกัน
- คนที่ไม่อยากเขียน design system เองตั้งแต่ศูนย์

ลองเปิด [github.com/voltagent/awesome-design-md](https://github.com/voltagent/awesome-design-md) ดูครับ — เลือกสไตล์ที่ชอบ โหลดมาวาง แล้วบอก AI ให้ใช้
