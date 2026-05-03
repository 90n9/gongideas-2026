---
title: "n8n + GPT-4o Pipeline"
ideaId: "002"
summary: "ทดลองงาน automate ที่ลด manual time ได้ 80% — เคสจริงจาก client เล็ก ๆ ที่ต้องคัด lead ทุกวัน"
category: "ai-automation"
status: "shipped"
difficulty: 2
date: 2026-03-30
tools: ["n8n", "GPT-4o", "Airtable", "Slack"]
reads: 31
cover: "COVER · TBD"
---

## ที่มา

Client เป็น agency เล็ก ๆ ที่ต้องคัด inbound leads จาก contact form ทุกวันก่อน assign ให้ทีม. ก่อนหน้านี้ใช้คน 1 ชม./วัน — น่าเบื่อและบ่อยครั้งคัดไม่ทัน.

## Pipeline

```
Webhook (form submit)
  → GPT-4o classify (Hot / Warm / Cold + reason)
  → Airtable upsert
  → Slack thread per Hot lead
  → Daily digest at 09:00 ICT
```

## Trade-offs

- **Cost**: ~$0.01/lead — น้อยกว่าค่าจ้างคนหลาย order of magnitude
- **Accuracy**: 92% agreement กับ manual labeling on a 200-lead validation set
- **Failure modes**: spam ที่ดูเป็นภาษาธุรกิจถูก mis-classify เป็น Warm — แก้ด้วย rules-based filter ก่อน GPT step

## Lessons

อย่าให้ GPT ทำทั้ง classify + write reply ใน step เดียวกัน. แยก concerns. classify ที่ดีกับ reply ที่ดีต้องการ prompt คนละแบบ และ debug ง่ายกว่ามากเมื่อ output ของแต่ละ step ตรวจสอบได้แยกกัน.
