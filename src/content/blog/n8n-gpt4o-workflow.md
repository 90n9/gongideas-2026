---
title: "สร้าง Workflow Automation ด้วย n8n + GPT-4o"
summary: "วิธีคัด lead อัตโนมัติให้ client agency เล็ก ๆ ที่เจอ inbound 50–80 คน/วัน — ลด manual time 80%, cost ~$0.01/lead"
date: 2026-04-25
tags: ["automation"]
relatedIdea: "n8n-gpt4o"
---

โพสต์นี้เป็น breakdown ของ workflow ที่ผม build ให้ client เล็ก ๆ — agency ที่รับ inbound leads ผ่าน contact form ทุกวัน. ก่อนหน้า: คนนึง 1 ชม./วัน. หลัง: 5 นาที (สำหรับการ review edge cases).

## ปัญหา

- Inbound: 50–80 leads/วัน
- ต้อง classify เป็น Hot / Warm / Cold
- ต้อง assign ให้ทีมที่ตรง vertical
- ต้องส่ง follow-up email ภายใน 4 ชั่วโมงสำหรับ Hot

## Stack

```
n8n (self-hosted)
├── Webhook trigger
├── GPT-4o classify node
├── Airtable upsert
├── Slack thread per Hot lead
└── Cron 09:00 → daily digest
```

## Classify prompt (ย่อ)

```
You are a lead-quality classifier for a B2B agency.
Inputs: company, role, budget hint, message.
Output JSON: { tier: "hot"|"warm"|"cold", reason: string }

Rules:
- "hot" = budget mentioned > $5k AND clear timeline within 90d
- "cold" = generic info request, no project signal
- otherwise "warm"

If the message is spam or not English/Thai, output { tier: "cold", reason: "spam_or_unparseable" }.
```

## ที่ผมเรียนรู้

- **อย่าให้ GPT ทำ classify + draft reply ใน step เดียว** — debug ยาก, prompt ขัดแย้งกันเอง
- **ให้ rule-based filter ก่อน LLM** — spam ที่ดู professional ก็ยังโดน mis-classify ได้, แต่ rules จับได้ก่อน
- **Cost = $0.01/lead = ค่าน้อยมาก** เมื่อเทียบกับการให้คนทำ. แต่ถ้าจะ scale 10x ต้อง batch หลาย leads ใน 1 GPT call

## ตัวเลขจริง

| Metric | Manual | Automated |
|---|---|---|
| Time/day | 60 min | 5 min (review) |
| Accuracy | ~95% | 92% |
| Cost/day | $25 | $0.50 |
| Latency | 2–8 hr | <30 sec |

92% ฟังดูแย่กว่า แต่จริง ๆ การที่ Hot lead ถูก reply ภายใน 30 วิแทน 4 ชม. คุ้มกับ accuracy 3% ที่หายไป — และส่วนใหญ่ที่ผิดคือ "warm" ที่ควรเป็น "cold" ซึ่ง downstream ก็ไม่เสียหายมาก.
