---
title: "MynahPad — Prompt Queue Menu-Bar App"
ideaId: "004"
summary: "macOS menu-bar app เก็บลิสต์ prompt แล้ว double-click เพื่อ paste ลง terminal — rewrite จาก PyQt6 (~200MB) เป็น Swift native (~2MB)"
category: "ai-coding"
status: "shipped"
difficulty: 2
date: 2026-05-21
tags: ["AI Coding", "macOS"]
tools: ["Swift", "Xcode CLT", "Sparkle", "Claude Code"]
repoUrl: "https://github.com/90n9/mynah-pad"
liveUrl: "https://github.com/90n9/mynah-pad"
cover: "/assets/covers/mynah-pad.png"
---

## ทำไมถึงทำ

ตอนทำงานกับ AI coding tool ต้องสลับ prompt ซ้ำ ๆ บ่อย ๆ — copy/paste ตลอด ไม่ค่อย efficient. เลยอยากได้ app เล็ก ๆ ตัวเดียวที่:

- อยู่บน menu bar ตลอด, เปิดเร็ว
- เก็บ prompt ที่ใช้บ่อย ๆ เป็น list
- double-click prompt แล้วมัน paste ลง terminal ที่ active อยู่ทันที
- mark ว่าใช้ไปแล้ว (✓) เพื่อไม่ paste ซ้ำ

เดิมเคยทำ prototype ด้วย Python + PyQt6 ใช้ได้ปกติ แต่ build เป็น DMG ออกมา **~200MB** เพราะ pack Python runtime + Qt framework ทั้งชุด. รู้สึกว่ามันเกินจำเป็นไปมากสำหรับ utility เล็ก ๆ. เลยตัดสินใจ rewrite เป็น Swift native.

## ผลที่ได้

- Binary ~2MB (ลดลง ~100 เท่า)
- เปิดเร็วทันที, ไม่มี Python startup overhead
- ใช้ macOS API ตรง ๆ — `CGEventPost` สำหรับ paste, SwiftUI สำหรับ window
- Build ด้วย `swiftc` จาก Xcode CLT อย่างเดียว — ไม่ต้องมี Xcode เต็ม

## ใช้ AI ที่ไหนบ้าง

| Stage | AI ที่ใช้ |
| --- | --- |
| Port logic จาก PyQt6 → SwiftUI | Claude Code |
| Debug macOS TCC / code signing | Claude Code |
| เขียน `build.sh` + Sparkle auto-update integration | Claude Code |
| Migration helper สำหรับ notes.json schema เดิม | Claude Code |

## Tech ที่น่าสนใจ

- **SwiftUI** + menu bar (`NSStatusItem`) + `.draggable` / `.dropDestination` (ต้อง macOS 13+)
- **Sparkle** สำหรับ in-app auto-update (EdDSA signature verification)
- **GitHub Actions** build unsigned DMG ตอน tag `v*.*.*` — sign appcast locally ก่อน push
- Storage เป็น JSON ที่ `~/.config/mynahpad/notes.json` — schema เข้ากันได้กับ Python predecessor (auto-migrate ตอน first launch)

## Lessons

- **macOS TCC ผูก permission กับ designated requirement ไม่ใช่ bundle ID** — ad-hoc sign (`codesign --sign -`) ทำให้ designated requirement เป็น `cdhash` ที่เปลี่ยนทุกครั้งที่ rebuild, แล้ว Accessibility permission ที่ user grant ไว้จะ invalidate เงียบ ๆ. ต้อง self-signed cert ที่ stable เพื่อให้ designated requirement เป็น `certificate leaf` แทน — grant ถึงจะคงอยู่ข้าม rebuild

- **Swift native ดี แต่ต้องยอมเจ็บกับ code signing**. ครึ่งหนึ่งของเวลาที่ใช้ debug ไปกับ TCC, certificate, Sparkle EdDSA key ฯลฯ — ไม่ใช่ business logic. แต่จบแล้ว ship ได้สวย

- **AI coding ช่วย bridge Python → Swift ได้ดี**. ไม่ใช่แค่ syntax translation — Claude ช่วย map concept (Qt signal/slot ↔ SwiftUI binding, `QSettings` ↔ JSON ที่ `~/.config/`) ให้ตรงกับ idiomatic ของแต่ละภาษา

- **Binary size matters สำหรับ utility tool**. 200MB → 2MB ไม่ใช่แค่ตัวเลข — user (รวมถึงตัวเอง) เปิดใจ install เร็วกว่ามาก, update เร็วกว่า, GitHub Actions runner cache เร็วกว่า. native > runtime-bundled สำหรับงานนี้

## What's next

- Hotkey global สำหรับเปิด window โดยไม่ต้องคลิก menu bar
- Folder/tag organization สำหรับ prompt ที่เยอะขึ้น
- Sync prompt list ผ่าน iCloud หรือ GitHub gist
