---
title: "Thailand Puzzle — Old Game to Web"
ideaId: "003"
summary: "พอร์ตเกมจิ๊กซอว์ภูมิศาสตร์ไทยจาก asset ปี 2014 ขึ้น web ด้วย Phaser 3 + Vite — ใช้ AI coding ช่วย convert"
category: "ai-coding"
status: "shipped"
difficulty: 1
date: 2026-05-01
tools: ["Phaser 3", "Vite", "TypeScript", "Claude Code"]
liveUrl: "https://thailand-puzzle.gongideas.com/"
repoUrl: "https://github.com/90n9/thailand-puzzle-web"
cover: "/assets/covers/thailand-puzzle-web.png"
---

## ที่มา

Asset เกมจิ๊กซอว์ภูมิภาคของไทย (เหนือ, อีสาน, กลาง, ตะวันออก, ใต้) ที่ผมทำไว้ตั้งแต่ ~ปี 2014 — เป็นเกมเล็ก ๆ สำหรับเรียนภูมิศาสตร์ไทย. เก็บอยู่ใน folder เก่า ไม่ได้ ship ที่ไหนตั้งหลายปี. ปลายเดือนเมษา 2026 ผมเปิดมาดูแล้วคิดว่า "ถ้า AI coding ช่วย convert ขึ้นเว็บได้เร็วพอ ก็น่าจะ resurrect มัน".

## Approach: AI as porting partner

แทนที่จะเขียนใหม่ตั้งแต่ศูนย์, ผมส่ง:

1. โครงเกมเก่า (asset folders + เนื้อหา gameplay)
2. Spec ใหม่: Phaser 3 + Vite + TypeScript, หน้า menu / map page / tutorial
3. ให้ Claude Code ออกแบบ scene structure, asset loader, state machine

แล้ว iterate เป็นรอบ ๆ:
- รอบแรก: bootstrap project + load assets + render menu
- รอบสอง: drag-and-drop region pieces + scoring
- รอบสาม: tutorial scene + sound + win/lose flow
- รอบสี่: polish, mobile responsiveness, deploy build

## ผลที่ได้

- TypeScript 97.7% ของ codebase — strict types ทั้งโปรเจกต์
- Asset เก่าถูก preserve ตามเดิม (ภาพ Photoshop CS5.1 ปี 2014 ยังใช้งานได้บน Phaser ในปี 2026)
- เล่นได้บน browser ทั้ง desktop + mobile
- Build เป็น static site ผ่าน Vite — ขึ้น hosting ที่ไหนก็ได้

## Lessons

- **AI ช่วย porting งานเก่าได้ดีกว่าที่คิด** — เพราะ logic ของเกมเก่ามีให้อ่าน, AI ไม่ต้อง guess intent. มัน reverse-engineer + แปลงเป็น TS code ได้ค่อนข้างตรง
- **Phaser 3 + Vite stack ทำให้ build/dev loop เร็วมาก** — hot reload ภายใน 200ms, เทียบกับ Phaser 2 / webpack ในยุคเก่า
- **Asset ดี = workflow เร็ว** — เพราะภาพยัง อยู่ครบ, ไม่ต้อง recreate. ถ้าต้องไป commission art ใหม่คงใช้เวลาอีกหลายเท่า
- **AI ไม่ได้ skip การอ่าน code เก่า** — ผมยังต้องเข้าไปอ่าน + อธิบาย state ที่ implicit ใน code เก่าให้มันก่อน implement ใหม่ได้

## What's next

- เพิ่ม mode hard (จับเวลา + ไม่มี hint)
- รองรับ multi-language (ตอนนี้ Thai เป็นหลัก, English asset ยังไม่ครบทุก scene)
- ทำ leaderboard เก็บคะแนนผ่าน supabase หรือ static-friendly backend
