---
title: "Create Your Own Skill"
summary: "ไม่ต้องเขียน skill เองตั้งแต่ศูนย์ — แค่บอก skill-creator ว่า \"เอา task ที่เพิ่งทำเสร็จไปแพ็คเป็น skill ให้หน่อย\" แล้วมันแพ็คให้ทั้งโครงสร้างไฟล์"
date: 2026-05-24
tags: ["ai-coding", "skills"]
---

> ถ้ายังไม่รู้ว่า skill คืออะไร อ่าน [What is a Skill in AI Coding?](/blog/what-is-a-skill-in-ai-coding/) ก่อนได้ครับ

หลายคนพอเข้าใจแล้วว่า skill มีประโยชน์ยังไง ก็จะคิดต่อว่า — "แล้วถ้าอยากทำ skill ของตัวเองล่ะ ต้องเริ่มยังไง?"

คำตอบคือ: **ไม่ต้องเริ่มจากศูนย์** — มี skill ตัวหนึ่งที่ทำหน้าที่ "สร้าง skill ใหม่" ให้เราอีกที ชื่อว่า [`skill-creator`](https://www.skills.sh/anthropics/skills/skill-creator)

## วิธีใช้

ง่ายมากแบบเหลือเชื่อ:

**Step 0 — install skill เข้า project ก่อน** (รันใน terminal ที่ folder project)

```bash
npx skills add https://github.com/anthropics/skills --skill skill-creator
```

แล้วเปิด `claude` หรือ `codex` ขึ้นมาในโฟลเดอร์เดียวกัน

**Step 1** — ทำงานปกติกับ AI ไปก่อน — แก้บัค, deploy, สร้าง component, อะไรก็ได้

**Step 2** — พอเสร็จแล้ว สั่งว่า "เอา task ที่เพิ่งทำเสร็จไปแพ็คเป็น skill ให้หน่อย"

**Step 3** — `skill-creator` จะดู flow ที่เพิ่งทำ → แพ็คเป็นโครงสร้างไฟล์ skill ให้พร้อมใช้

ครั้งหน้าเรียก skill นั้นได้เลยโดยไม่ต้องอธิบาย flow ใหม่

## หน้าตาไฟล์ที่ได้

skill ที่ถูกสร้างออกมาคือไฟล์ **Markdown (`.md`)** ธรรมดา — เปิดอ่านง่าย ไม่ใช่ binary หรือ format ลึกลับอะไร

ถ้าเปิดด้วย **VS Code** กดปุ่ม preview (`Cmd+Shift+V` บน macOS / `Ctrl+Shift+V` บน Windows) จะเห็น render ออกมาเป็นเอกสารสวย ๆ อ่านได้สบาย ๆ — แก้เนื้อหาเพิ่มเองตรงไหนก็ได้ตามใจ

## ทำไมถึงคุ้ม

- งานที่เราทำซ้ำ ๆ — กลายเป็น skill ในไม่กี่นาที
- ไม่ต้องไปอ่าน spec ของ skill format เอง — `skill-creator` รู้ให้
- แชร์ skill ให้ทีมหรือ community ก็ได้

## ลองเลย

install `skill-creator` จาก [skills.sh](https://www.skills.sh/anthropics/skills/skill-creator) แล้วลองเปลี่ยน task ที่เพิ่งทำเป็น skill ของตัวเองดู — เผื่อรอบหน้าจะได้ไม่ต้องเริ่มใหม่ทุกครั้ง
