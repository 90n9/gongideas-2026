---
title: "L+T Market — Voucher Marketplace"
ideaId: "002"
summary: "Freelance project ล่าสุด — voucher booking sub-site ของ lifestyleandtravel.com, ใช้ AI ตั้งแต่ design, hero image, ถึง code ทั้ง stack"
category: "ai-coding"
status: "shipped"
difficulty: 2
date: 2026-04-29
tools: ["CodeIgniter 4", "PHP 8", "MySQL", "Tailwind CSS", "MidJourney", "Claude Code", "Docker"]
liveUrl: "https://market.lifestyleandtravel.com"
repoUrl: "https://github.com/90n9/ltmarket"
cover: "/assets/covers/ltmarket.png"
---

## Brief

Client (lifestyleandtravel.com) ต้องการ sub-site แยก สำหรับขาย voucher ที่พัก/ทริป — ลูกค้าเลือก deal, จอง, ได้ booking ref ทันที, จ่ายเงินผ่าน LINE/Email กับทีม admin. ต้องมี admin panel ครบ: voucher CRUD, booking workflow, audit log, CSV export, etc.

## ใช้ AI ที่ไหนบ้าง

โปรเจกต์นี้คือการทดลองว่า **AI ช่วยจริง ๆ ได้ทุก stage ของ freelance product** ไม่ใช่แค่ help เขียน function ทีละจุด.

| Stage | AI ที่ใช้ |
| --- | --- |
| UX/UI design discussion | ChatGPT (brainstorm flow, edge cases) |
| Hero section image | MidJourney (สร้าง brand cover ที่ใช้บนหน้า home + Facebook) |
| Promo video | Runway / Hailuo (short clip สำหรับ promotion) |
| Code (frontend + backend + admin) | Claude Code (CodeIgniter scaffold, Tailwind UI, admin CRUD) |
| Migration & seed | Claude Code (25 migration files + seeders) |

## Tech Stack

- **Backend**: CodeIgniter 4.3 + PHP 8.2
- **DB**: MySQL 8 (utf8mb4)
- **Frontend**: Tailwind CSS 3.4 + Vanilla JS (ไม่ใช้ framework เพราะ host เป็น shared hosting)
- **Dev**: Docker Compose (PHP+Apache, MySQL, phpMyAdmin)
- **Editor**: Editor.js สำหรับ admin notes / FAQ rich text

## What shipped

**Public site**
- Voucher listing + filter, voucher detail พร้อม sticky CTA, booking form กับ instant ref
- SEO ครบ: Schema.org JSON-LD, OG, sitemap, GA4
- PDPA cookie consent banner

**Admin panel**
- Dashboard กับ stats, low-stock alerts, charts
- Voucher CRUD + multi-image upload, duplicate, archive, SEO fields
- Booking workflow: NEW → AWAITING_PAYMENT → PAID_CONFIRMED → TICKET_ISSUED → COMPLETED (กับ CANCELLED แตกข้าง)
- Audit log + CSV export + bulk actions
- Email-based password reset ด้วย SHA-256 token

## Lessons

- **ลูกค้าให้ resource มาแค่ Facebook page กับเว็บหลัก** — ไม่มี brand guide, ไม่มี asset อื่น. ใช้ Claude Code ไปดึง design จากเว็บหลักมาเป็นต้นแบบ ผสมกับโลโก้จาก Facebook ได้ผลลัพธ์ที่สอดคล้องกับ brand โดยไม่ต้องรอ designer

- **MidJourney + Hailuo ครบ loop งานภาพ**. MidJourney สร้างภาพตกแต่งทุกส่วนของเว็บ, Hailuo แปลงภาพนิ่งเป็นวิดีโอตาม requirement ลูกค้า — จบในขั้นตอนเดียวโดยไม่ต้องจ้าง videographer

- **คุย requirement กับ Claude ก่อน ได้ structure ที่ดีกว่า**. เอา requirement คร่าว ๆ จากลูกค้ามาคุยกับ Claude เพื่อออกแบบ structure ของทั้งหน้าบ้านและหลังบ้านให้สอดคล้องกันตั้งแต่ต้น ลด rework หลัง dev ไปแล้ว

- **PHP version บน shared hosting คือ trap**. พัฒนาด้วย PHP เวอร์ชันล่าสุด พอได้ hosting จริงมาพบว่าเป็นเวอร์ชันเก่าที่ CodeIgniter ล่าสุดรองรับไม่ได้ ต้อง downgrade และแก้ code หลายจุด — ครั้งหน้าต้องถาม hosting spec ก่อน dev

- **Claude ช่วย audit migration checklist ได้เร็วมาก**. ตอน downgrade ใช้ Claude สร้าง checklist ครบว่าต้องแก้ไขอะไรบ้าง แทนที่จะ grep เองทีละไฟล์

- **Playwright automation test เขียนโดย Claude ทั้งหมด**. เราแค่นั่งดู test รัน และ intervene เมื่อ loop นานผิดปกติ — ประหยัดเวลา manual test ไปได้มาก

## ที่ยังอยากทำต่อ

- Refactor booking ref generator ให้ idempotent กว่านี้ (case race ตอน admin หลายคนกดพร้อมกัน)
- เขียน workflow doc แยกสำหรับทีมที่ดูแลต่อ — โดยเฉพาะส่วน status transition rules
