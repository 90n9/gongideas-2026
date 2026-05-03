---
title: "ทดลอง Claude Code: เซตอัพ Sub-agent ให้ทำงานเป็นทีม"
summary: "บันทึก experiment ของผมในการแบ่งงาน coding ออกเป็น Scout / Surgeon / Reviewer แล้วให้ทั้งสามตัวรันแบบขนาน"
date: 2026-04-30
tags: ["ai-coding", "claude"]
relatedIdea: "claude-sub-agents"
---

ปัญหาที่อยากแก้: เวลาผมให้ Claude Code อ่าน codebase แล้วแก้บั๊ก context window มันโดนกินไปเรื่อย ๆ ตั้งแต่ก่อนได้แก้บั๊กจริง ๆ.

ทางแก้ที่ผมลอง: **แบ่งบทบาท**.

## Three roles

### Scout

ค้นไฟล์, อ่าน excerpt, รายงานกลับเป็น summary สั้น ๆ. **ห้ามแก้ไข**. นี่คือ key — ถ้า Scout แก้ได้, มันจะเริ่ม "ช่วย" ตอนหา และทำงานบาน.

### Surgeon

รับ summary จาก Scout ผ่าน prompt template, แก้ไขตรงจุด. ไม่เห็น exploration logs. แค่ "ที่ตรงนี้, แก้แบบนี้".

### Reviewer

รัน *หลัง* Surgeon เสร็จ. ไม่เห็น Surgeon's reasoning, แค่เห็น diff. หน้าที่: หา regression ที่ Surgeon มองไม่เห็น.

## ทำไมถึง work

> Independence is the entire point. ถ้า Reviewer รู้ว่า Surgeon คิดยังไงตอนแก้, Reviewer จะ rationalize แทนที่จะ critique.

## ผลลัพธ์ที่วัดได้

- Average bug-fix time: 45min → 15min
- Main context usage ตอนสรุป: ลดลง ~60% เพราะการสำรวจไม่ค้างอยู่
- Bug ที่ Reviewer จับได้ก่อน merge: 3 จาก 12 cases (แต่เป็น 3 ตัวที่หาเองคงไม่เจอ)

## สิ่งที่ยังต้องลอง

- Async coordination ผ่าน scratchpad shared file
- Auto-spawn agent ตอน detect commit type (feat = Surgeon-only; refactor = three-agent)
- Cost tracking — ตอนนี้ยังไม่มี dashboard ดูว่า each role กิน token เท่าไหร่
