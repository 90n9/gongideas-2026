---
title: "Veo 3 Cinematic Test"
ideaId: "003"
summary: "สร้างหนังสั้น 30 วินาทีจาก prompt อย่างเดียว — บันทึก iteration ของ shot list ทั้งหมดก่อนได้ผลลัพธ์ที่พอใจ"
category: "ai-video"
status: "wip"
difficulty: 4
date: 2026-05-01
tools: ["Veo 3", "Runway Gen-3", "DaVinci Resolve"]
progress: 35
cover: "COVER · TBD"
---

## เป้าหมาย

ทำหนังสั้น 30 วินาทีเรื่อง "วันธรรมดาของ Bulby" ด้วย AI video gen ทั้งหมด แล้วเทียบกับการ shoot จริง — ไม่ใช่เพื่อทดแทน, แต่เพื่อรู้ว่าตอนนี้ AI video gen ใช้งานจริงได้ระดับไหนแล้ว.

## Shot list (current)

1. Bulby ลอยอยู่บนโต๊ะทำงาน, golden hour
2. Pan ไปที่หน้าจอที่กำลังคอมไพล์โค้ด
3. Bulby กระพริบเมื่อ build success
4. Cut to outdoor — Bulby นั่งดูพระอาทิตย์ตก
5. Title card: "Let's imagine come true."

## ปัญหาที่เจอ

- **Character consistency**: Bulby ใน shot 1 vs shot 4 ดูไม่เหมือนกัน. ต้อง lock down กับ reference image แทนการ rely on text prompt
- **Camera vocabulary**: prompt แบบ "slow dolly-in" ได้ผลไม่สม่ำเสมอ. shot 2 ต้อง re-render 8 ครั้ง
- **Cut timing**: AI ไม่เข้าใจ pacing — ต้อง edit เอง

## สิ่งที่ยังค้าง

- ทดลอง pipeline: storyboard ใน Sora → final shot ใน Veo 3
- หา style reference ที่ stable พอ ไม่ให้ shot เหวี่ยงไปคนละทิศ
- เขียน workflow doc ให้ client ที่อยากใช้ AI video สำหรับ ad pitch
