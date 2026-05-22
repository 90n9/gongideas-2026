---
title: "What is a Skill in AI Coding?"
summary: "ทำความรู้จักกับ \"Skill\" — แพ็คคำสั่ง/workflow ที่โหลดเข้า AI coding tool ของคุณได้ในคลิกเดียว และที่ที่ใช้ค้นหา skill ใหม่ ๆ"
date: 2026-05-23
tags: ["ai-coding", "skills"]
draft: true
---

ช่วงนี้คำว่า **Skill** เริ่มได้ยินบ่อยมากในวงการ AI coding — แต่จริง ๆ แล้วมันคืออะไร? ทำไมถึงควรรู้จักไว้?

## Skill คืออะไร

พูดง่าย ๆ Skill คือ **แพ็คคำสั่ง / workflow / ความรู้เฉพาะทาง** ที่ใส่เข้าไปให้ AI coding tool (เช่น Claude Code) ใช้งานได้ทันที โดยที่เราไม่ต้องมานั่งอธิบายให้ AI ฟังใหม่ทุกครั้ง

ลองนึกภาพแบบนี้ — สมมุติทุกครั้งที่จะรีวิว PR เราต้องพิมพ์บอก AI ว่า "อ่าน diff, เช็ค edge case, ดู test coverage, ตรวจ security pattern..." ซ้ำ ๆ ทุกวัน

แทนที่จะพิมพ์ใหม่ทุกครั้ง ก็แพ็ครวมเป็น Skill ตัวเดียวชื่อ `/code-review` — เรียกเมื่อไรก็ทำตาม flow ที่กำหนดไว้แล้วทั้งหมด

## ตัวอย่าง Skill ที่ผมใช้

- **`huashu-design`** — สำหรับงาน design (อันที่ใช้ทำเว็บนี้)
- **`/loop`** — สั่งให้ AI ทำ task ซ้ำ ๆ ตามรอบเวลา
- **`/rpi`** — workflow Research → Plan → Implement
- **`/pr-reply`** — ตอบ + resolve review thread บน GitHub PR

ทุกตัวคือ skill ที่ใครสักคนแพ็คไว้ให้แล้ว เราแค่ install + เรียกใช้

## หา skill ใหม่ ๆ ได้ที่ไหน

แนะนำ **[skills.sh](https://www.skills.sh/)** — เป็นที่รวม skill จาก community ค้นหาตาม use case ที่อยากได้แล้วลองเอามาใช้ดู

ถ้ายังไม่รู้จะเริ่มจากตัวไหน ลอง browse ดูพวก design, code review, PR workflow ก่อน เป็นกลุ่มที่คนใช้บ่อย

## ทำไมถึงคุ้ม

- **ประหยัด token** — ไม่ต้องอธิบาย flow ซ้ำทุก session
- **ผลลัพธ์คงที่** — flow เหมือนกันทุกครั้งที่เรียก
- **ไม่ต้องเขียนเอง** — มีคนแพ็คไว้ให้แล้ว ใช้ของฟรีจาก community ได้เลย

ลองเปิด [skills.sh](https://www.skills.sh/) ดูครับ น่าจะมีสักตัวที่เข้ากับงานที่ทำอยู่
