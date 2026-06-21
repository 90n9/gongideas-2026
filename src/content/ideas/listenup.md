---
title: "ListenUp — Thai Listening Practice for Kids"
ideaId: "005"
summary: "เว็บแอปฝึกฟังภาษาไทยกับลูกวันละ 5 นาที — พ่อแม่อ่านเรื่องสั้นให้ฟัง ลูกตอบคำถาม คลัง 90 เรื่อง 3 ระดับ ทั้ง content และ app เกิดจาก Claude Code"
category: "ai-coding"
status: "shipped"
difficulty: 3
date: 2026-06-21
tags: ["AI Coding", "Kids", "Thai"]
tools: ["Claude Code", "React", "Vite", "TypeScript", "Tailwind CSS"]
liveUrl: "https://listenup.gongideas.com"
cover: "/assets/covers/listenup.png"
---

## ทำไมถึงทำ

อยากมีกิจกรรมสั้น ๆ ที่นั่งทำกับลูกได้ทุกวันโดยไม่ต้องยื่นจอให้ลูกจ้อง — แค่ **5 นาทีต่อวัน** ฝึก "ฟังเป็น ตอบได้". ไอเดียง่ายมาก: พ่อแม่อ่านเรื่องสั้นให้ลูกฟัง แล้วถามคำถามจับใจความ ลูกตอบด้วยปากเปล่า

จุดที่ผมชอบของ approach นี้คือ **ไม่ต้องมีไฟล์เสียงเลย** — "เสียง" ที่ลูกฟังคือเสียงพ่อแม่จริง ๆ. แอปทำหน้าที่แค่ป้อนเรื่อง + คำถาม + เฉลย + เก็บ streak ให้ ไม่ต้องลง TTS, ไม่ต้อง host audio, ไม่ต้อง login. ทั้งหมดเป็น static SPA ตัวเดียว

## ผลที่ได้

- คลัง **90 เรื่อง** แบ่ง 3 ระดับ (1 ง่าย/สั้น → 3 ท้าทาย/ยาวขึ้น) และ 6 หมวด: ครอบครัว, สัตว์, ชีวิตประจำวัน, มารยาท, ธรรมชาติ, อาหาร
- แต่ละเรื่องมี passage สั้น + คำถามจับใจความ 3 ข้อ พร้อม "เฉลย" ให้พ่อแม่กดดูตอนให้คะแนน
- เนื้อหาผสมเรื่องแต่งเองกับนิทานอีสปเล่าใหม่เป็นภาษาไทย (เต่ากับกระต่าย, มดกับตั๊กแตน, กากับเหยือกน้ำ ฯลฯ)
- Gamification เบา ๆ: ดาว, สตรีค, "เล่นล่าสุด" — เก็บใน `localStorage` ล้วน ไม่มี backend/บัญชีผู้ใช้
- ฉลองจบรอบด้วย confetti + มาสคอตเด็กผู้ชายเสื้อเขียว (ภาพ generate จาก AI)

## การเล่น 1 รอบ

```
เลือกการ์ด (เรื่องสั้น / คำถาม / สุ่ม)
   → พ่อแม่อ่าน passage ออกเสียงให้ลูกฟัง  (🔊 อ่านให้ลูกฟัง)
   → กดดูคำถามทีละข้อ ลูกตอบด้วยปากเปล่า
   → พ่อแม่กด "เฉลย" เทียบคำตอบ แล้ว self-grade ถูก/ผิด
   → สรุปคะแนน + confetti + สตรีคเพิ่ม
```

เด็กไม่ต้องอ่านเองและไม่ต้องพิมพ์ — ทุกอย่างผ่านการฟังกับพูด ซึ่งคือทักษะที่ตั้งใจฝึก

## ใช้ AI ที่ไหนบ้าง

| Stage | AI ที่ใช้ |
| --- | --- |
| เขียน app ทั้งตัว (React + Vite + TS + Tailwind) | Claude Code |
| Generate คลัง 90 เรื่อง + คำถาม + เฉลย เป็นภาษาไทย | Claude |
| Image prompts + มาสคอต/โลโก้ (flat-vector kids style) | Claude + image gen |
| Dockerfile + nginx + deploy บน Hostinger | Claude Code |
| หน้า privacy / terms + consent-gated GA4 | Claude Code |

ทั้ง **โค้ด** และ **เนื้อหา** มาจาก AI — ส่วนที่ AI *ไม่ได้* ทำคือเสียง เพราะตั้งใจให้เป็นเสียงพ่อแม่ตั้งแต่แรก

## Tech ที่น่าสนใจ

- **Vite + React 18 + TypeScript + Tailwind v4** — SPA ล้วน, routing ด้วย React Router (`/`, `/browse`, `/play`, `/results`)
- **ไม่มี backend** — progress/สตรีค/ประวัติ เก็บใน `localStorage` ทั้งหมด ทำให้ deploy เป็น static ได้ ไม่มี state ฝั่ง server ต้องดูแล
- Content เป็น **typed library** (`StorySet[]` มี `level`, `themes`, `sentence`, `questions`) — เพิ่มเรื่องใหม่ = append object ตัวเดียว ทั้ง browse/filter อัปเดตเอง (pattern เดียวกับ content collection ของ gongideas เลย)
- **Docker + nginx** build เป็น image แล้ว deploy ผ่าน Dokploy บน Hostinger
- **canvas-confetti** + Thai fonts (IBM Plex Sans Thai, Noto Sans Thai)

## Lessons

- **ลบ requirement ออกคือ feature**. ตอนแรกคิดจะทำ TTS อ่านเรื่องให้ฟัง — แต่พอเปลี่ยนเป็น "พ่อแม่อ่านเอง" แอปก็ไม่ต้องมี audio pipeline, ไม่ต้อง host ไฟล์เสียง, ไม่ต้องแก้ปัญหาเสียงไทยฟังไม่เป็นธรรมชาติ. แถมได้คุณค่าที่ดีกว่า — เด็กฟังเสียงพ่อแม่จริง ๆ

- **AI generate content corpus ได้เร็วมาก แต่ต้อง spec ให้คม**. การได้ 90 เรื่องที่ระดับภาษาคุมตาม level 1–3, คำถามจับใจความจริง (ไม่ใช่ถามคำต่อคำ), และมีเฉลยสั้นกระชับ — มาจากการล็อก format ของ `StorySet` ก่อน แล้วให้ AI เติมตาม schema ไม่ใช่ขอ "เขียนนิทานมา 90 เรื่อง" ลอย ๆ

- **No-backend ทำให้ ship เร็ว**. ตัด login/DB/API ออกหมด เหลือแค่ static + localStorage — จาก idea ถึง live บน domain จริงใช้เวลาน้อยมาก เพราะไม่มี infra ให้ดูแล

## What's next

- เพิ่มเรื่องและระดับให้ลึกขึ้น (ระดับ 4–5 สำหรับเด็กโต)
- โหมดให้เด็กที่อ่านออกแล้วอ่านเองได้ (ตอนนี้ออกแบบให้พ่อแม่อ่าน)
- สถิติรายสัปดาห์ให้พ่อแม่เห็นว่าฝึกหมวดไหนไปแล้วบ้าง
- อาจลองใส่ TTS เป็น option เสริม (ไม่ใช่ default) สำหรับวันที่พ่อแม่ไม่ว่าง
