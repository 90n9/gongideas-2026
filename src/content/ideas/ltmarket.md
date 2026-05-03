---
title: "L+T Market — AI-Assisted Voucher Marketplace"
ideaId: "002"
summary: "Freelance project ล่าสุด — voucher booking sub-site ของ lifestyleandtravel.com, ใช้ AI ตั้งแต่ design, hero image, ถึง code ทั้ง stack"
category: "ai-coding"
status: "shipped"
difficulty: 4
date: 2026-04-29
tools: ["CodeIgniter 4", "PHP 8", "MySQL", "Tailwind CSS", "MidJourney", "Claude Code", "Docker"]
repoUrl: "https://github.com/90n9/ltmarket"
cover: "/assets/covers/ltmarket.jpg"
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

**Admin panel** (/admin)
- Dashboard กับ stats, low-stock alerts, charts
- Voucher CRUD + multi-image upload, duplicate, archive, SEO fields
- Booking workflow: NEW → AWAITING_PAYMENT → PAID_CONFIRMED → TICKET_ISSUED → COMPLETED (กับ CANCELLED แตกข้าง)
- Audit log + CSV export + bulk actions
- Email-based password reset ด้วย SHA-256 token

## Lessons

- **AI image gen ขายได้จริงในงาน client**. Hero ที่ใช้บนเว็บคือ MidJourney ล้วน — client approve ภายใน iteration ที่ 3
- **Admin panel กับ Editor.js** = ลูกค้าอัปเดตเอกสารกฎหมาย (Terms/Privacy/Cookie) เองได้, ลด bug แบบ "แก้คำผิดให้หน่อย"
- **Claude Code + CI4 = combo อันตราย (ในทางดี)**. Scaffold model + migration + view + controller ได้พร้อมกันและ pattern สม่ำเสมอ
- **Stack แบบเก่า (PHP+MySQL+Vanilla JS) ยัง ship เร็วที่สุดสำหรับ shared hosting**. ไม่ต้อง explain build pipeline ให้คนที่ดูแลต่อ

## ที่ยังอยากทำต่อ

- Refactor booking ref generator ให้ idempotent กว่านี้ (case race ตอน admin หลายคนกดพร้อมกัน)
- เขียน workflow doc แยกสำหรับทีมที่ดูแลต่อ — โดยเฉพาะส่วน status transition rules
