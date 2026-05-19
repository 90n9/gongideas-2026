---
title: "The Owl's Nook — AI Bedtime Stories"
ideaId: "001"
summary: "ช่อง YouTube เล่า Aesop's Fables สไตล์ Pixar ให้ลูกชายอายุ 3 ขวบดูก่อนนอน — pipeline AI ล้วน ๆ ตั้งแต่ storyboard ถึง final cut"
category: "ai-video"
status: "shipped"
difficulty: 5
date: 2025-12-15
tools: ["ChatGPT", "MidJourney", "Runway", "Hailuo AI", "ElevenLabs", "Suno", "CapCut"]
liveUrl: "https://www.youtube.com/@TheOwlsNook"
cover: "/assets/covers/the-owls-nook.png"
---

## ทำไมถึงเริ่ม

ตอนที่ลูกชายอายุ 3 ขวบ ผมอยากมีคลิปสั้น ๆ ที่ผมกับลูกนั่งดูด้วยกันก่อนนอนได้ — และอยากใช้โอกาสนี้ลองดูจริง ๆ ว่า AI generative tools ในปี 2025 ทำหนัง animation สั้น ๆ แทนสตูดิโอเล็ก ๆ ได้แค่ไหน. ผลที่ได้คือช่อง **The Owl's Nook** — เจ้าฮูกแก่ ๆ ใจดี เล่านิทานอีสปกับ bedtime story สไตล์ Pixar.

## Pipeline (เวอร์ชันที่ใช้จริง)

```
ChatGPT  → storyboard + script (shot list, narration)
MidJourney → key frames + character design
Runway / Hailuo / Midjourney → image-to-video สำหรับแต่ละ shot
ElevenLabs → narration เสียงคุณตา
Suno → background music + opening jingle
CapCut → cut, mix, subtitle, export
```

แต่ละ shot คือ image → video แยกตัว แล้วเอามาตัดต่อใน CapCut. ความท้าทายไม่ได้อยู่ที่เครื่องมือใดเครื่องมือหนึ่ง — มันอยู่ที่ **การประสานทั้งหมดให้ตัวละครเหมือนเดิมข้าม shot**.

## Trade-offs ที่เจอจริง

- **Character drift**: ฮูกใน shot 1 vs shot 8 หน้าไม่เหมือนกันเลย ต้องล็อก reference image อย่างหนักและ iterate หลายรอบ
- **Prompt → image → regenerate loop**: copy prompt จาก ChatGPT ไป MidJourney แล้วได้ภาพไม่ตรง storyboard ต้อง regen 4–6 ครั้งต่อ shot
- **Audio sync**: เสียง narration จาก ElevenLabs สวย แต่ pacing ไม่ตรงกับ animation จาก Runway — ต้องตัดทีละ frame ใน CapCut
- **End-to-end ต่อ 1 ตอน**: ~6–10 ชั่วโมง สำหรับคลิป 2–3 นาที

## ทำไมหยุด (ตอนนี้)

ตอนนั้นงานหลักเริ่มกินเวลา ทำให้ workflow แบบ manual หลาย ๆ ขั้น (โดยเฉพาะการ copy prompt + regen image/video หลายรอบ + edit ใน CapCut) มันไม่ scale กับเวลาที่เหลือต่อสัปดาห์. ช่องเลย ship ไป 24 ตอน แล้ว pause ไว้ก่อน.

## ถ้ากลับมาทำ

จะหา orchestration ที่:
- Lock character ด้วย ref image ตั้งแต่ต้น pipeline ไม่ใช่ regen ที่ MidJourney แต่ละ shot
- Auto chain: storyboard → image → video → audio → cut โดยไม่ต้อง manual copy ระหว่างเครื่องมือ
- ลด edit time ใน CapCut ด้วย rough cut อัตโนมัติจาก beat ของ narration

นี่คือเหตุผลหนึ่งที่ผมสนใจ AI workflow orchestration มาก ๆ ตอนนี้ — มันคือ bottleneck จริง ๆ ของการทำ AI content solo.
