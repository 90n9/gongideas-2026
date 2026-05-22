---
title: "Claude Code Advisor — Sonnet by Default, Opus on Demand"
summary: "ใช้ Sonnet เป็น model หลัก แล้วให้ Opus คอยช่วยเฉพาะตอนที่งานยาก — ได้ผลใกล้เคียง Opus โดยไม่ต้องจ่ายราคา Opus ตลอดเวลา"
date: 2026-05-20
tags: ["ai-coding", "claude", "claude-code"]
---

ถ้าใช้ **Claude Code** (CLI ของ Anthropic ที่รันใน terminal) อยู่ มี feature นึงที่น่าลองมากชื่อว่า **Advisor**

โดยปกติเวลาเลือก model ใน Claude Code จะมีให้เลือกระหว่าง Sonnet กับ Opus — Sonnet เร็วและถูกกว่า ส่วน Opus ฉลาดกว่าแต่แพงกว่า Advisor แก้ปัญหานี้ด้วยการให้เราใช้ Sonnet เป็นหลัก แล้วให้ Opus มาช่วยเฉพาะตอนที่งานยากหรือต้องตัดสินใจสำคัญ

## วิธีเปิดใช้

พิมพ์ `/advisor` ใน Claude Code

<img src="/assets/blog-advisor-slash-command.png" alt="Claude Code command palette showing /advisor with description: Configure the Advisor Tool to consult a stronger model for guidance at key moments during a task" />

จะเห็น dialog ให้เลือก model ที่จะทำหน้าที่เป็น advisor เลือก Opus 4.7 แล้วกด Enter — เสร็จแล้ว

<img src="/assets/blog-advisor-config-dialog.png" alt="Advisor configuration dialog showing options: Opus 4.7 (selected), Sonnet 4.6, No advisor. Recommended setup: Sonnet as main model with Opus as advisor." />

จากนั้น Claude จะ escalate ขึ้นหา Opus เองโดยอัตโนมัติเมื่อจำเป็น ไม่ต้องสั่งทุกครั้ง

<img src="/assets/blog-advisor-in-action.png" alt="Claude Code terminal showing Advisor in action: 'Advising using Opus 4.7 — Advisor has reviewed the conversation and will apply the feedback', while the main session runs on Sonnet 4.6." />

> Anthropic แนะนำ setup นี้เองว่า Sonnet as the main model with Opus as the advisor — for certain workloads this gives near-Opus performance with reduced token usage.

## ทำไมถึงประหยัด

เพราะ Opus จะถูกเรียกใช้เฉพาะตอนที่งานต้องการจริง ๆ ส่วนงานทั่วไปอย่างเปิดไฟล์ แก้โค้ด หรือรัน command — Sonnet จัดการเองได้สบาย ๆ ในราคา Sonnet

ลองเปิดใช้ดูได้เลย ตั้งค่าแค่ครั้งเดียวต่อ session
