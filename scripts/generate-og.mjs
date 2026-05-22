#!/usr/bin/env node
// Generate OG images for blog posts: Bulby + speech bubble carrying title/summary.
// Output: public/og/<slug>.png (1200x630)

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const BLOG_DIR = path.join(ROOT, 'src/content/blog');
const OUT_DIR = path.join(ROOT, 'public/og');

const WIDTH = 1200;
const HEIGHT = 630;

const COLORS = {
  parchment: '#F5EBD8',
  parchmentDeep: '#EADCC2',
  ink: '#1A1A2E',
  inkSoft: '#2D2D44',
  orange: '#F08C1D',
  yellow: '#F2C94C',
  mint: '#5FE8C4',
  pink: '#FF4D8B',
  muted: '#6B6357',
};

function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const out = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    let val = kv[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (val.startsWith('[') && val.endsWith(']')) {
      val = val.slice(1, -1).split(',').map(s => s.trim().replace(/^"|"$/g, ''));
    }
    out[kv[1]] = val;
  }
  return out;
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Word-wrap aware of CJK/Thai (no spaces between Thai words; break on char).
function wrapText(text, maxCharsLatin) {
  const isThai = /[฀-๿]/.test(text);
  const lines = [];
  if (isThai) {
    // Wrap by grapheme count — Thai chars are visually ~1 em.
    const maxChars = Math.floor(maxCharsLatin * 0.78);
    let buf = '';
    for (const ch of text) {
      buf += ch;
      if (buf.length >= maxChars && /[\s฀-๿]/.test(ch)) {
        lines.push(buf.trim());
        buf = '';
      }
    }
    if (buf) lines.push(buf.trim());
  } else {
    const words = text.split(/\s+/);
    let buf = '';
    for (const w of words) {
      if ((buf + ' ' + w).trim().length > maxCharsLatin) {
        lines.push(buf.trim());
        buf = w;
      } else {
        buf = (buf + ' ' + w).trim();
      }
    }
    if (buf) lines.push(buf);
  }
  return lines;
}

// Bulby — pixel mascot, scaled-up SVG. Static (no animation) for image rendering.
function bulbySvg(x, y, scale) {
  const px = (px0, py0, w = 1, h = 1, fill) =>
    `<rect x="${x + px0 * scale}" y="${y + py0 * scale}" width="${w * scale}" height="${h * scale}" fill="${fill}"/>`;
  return [
    // bulb glass
    px(6, 1, 4, 1, '#F2C94C'),
    px(5, 2, 6, 1, '#F2C94C'),
    px(4, 3, 8, 1, '#F2C94C'),
    px(3, 4, 10, 1, '#F2C94C'),
    px(3, 5, 10, 1, '#F2C94C'),
    px(3, 6, 10, 1, '#F2C94C'),
    px(3, 7, 10, 1, '#F2C94C'),
    px(4, 8, 8, 1, '#F2C94C'),
    px(4, 9, 8, 1, '#F2C94C'),
    // highlight
    px(5, 3, 2, 1, '#FFE48C'),
    px(4, 4, 3, 1, '#FFE48C'),
    px(4, 5, 2, 1, '#FFE48C'),
    // outline
    px(6, 0, 4, 1, COLORS.ink),
    px(5, 1, 1, 1, COLORS.ink),
    px(10, 1, 1, 1, COLORS.ink),
    px(4, 2, 1, 1, COLORS.ink),
    px(11, 2, 1, 1, COLORS.ink),
    px(3, 3, 1, 1, COLORS.ink),
    px(12, 3, 1, 1, COLORS.ink),
    px(2, 4, 1, 4, COLORS.ink),
    px(13, 4, 1, 4, COLORS.ink),
    px(3, 8, 1, 1, COLORS.ink),
    px(12, 8, 1, 1, COLORS.ink),
    px(3, 9, 1, 1, COLORS.ink),
    px(12, 9, 1, 1, COLORS.ink),
    // smiley
    px(5, 6, 1, 1, COLORS.ink),
    px(10, 6, 1, 1, COLORS.ink),
    px(6, 7, 4, 1, COLORS.ink),
    px(6, 8, 4, 1, COLORS.pink),
    // screw base
    px(4, 10, 8, 1, COLORS.ink),
    px(5, 11, 6, 1, '#8a8aa0'),
    px(4, 12, 8, 1, COLORS.ink),
    px(5, 13, 6, 1, '#8a8aa0'),
    px(4, 14, 8, 1, COLORS.ink),
    px(6, 15, 4, 1, '#5a5a72'),
    px(6, 16, 4, 1, COLORS.ink),
    px(7, 17, 1, 1, COLORS.ink),
    px(8, 18, 1, 1, COLORS.ink),
    px(9, 19, 1, 1, COLORS.ink),
  ].join('');
}

function speechBubble({ x, y, w, h, tailY }) {
  // Single path: rectangle with a tail jutting out the right side toward Bulby.
  const shadowOffset = 8;
  const rightX = x + w;
  const tailLen = 56;
  const tailHalf = 28;
  const path = [
    `M ${x} ${y}`,
    `H ${rightX}`,
    `V ${tailY - tailHalf}`,
    `L ${rightX + tailLen} ${tailY + 6}`,
    `L ${rightX} ${tailY + tailHalf}`,
    `V ${y + h}`,
    `H ${x}`,
    `Z`,
  ].join(' ');
  return `
    <g>
      <path d="${path.replace(/M (\d+) (\d+)/, (_, mx, my) => `M ${+mx + shadowOffset} ${+my + shadowOffset}`)
        .replace(/H (\d+)/g, (_, hx) => `H ${+hx + shadowOffset}`)
        .replace(/V (\d+)/g, (_, vy) => `V ${+vy + shadowOffset}`)
        .replace(/L (\d+) (\d+)/g, (_, lx, ly) => `L ${+lx + shadowOffset} ${+ly + shadowOffset}`)
      }" fill="${COLORS.ink}" opacity="0.16"/>
      <path d="${path}" fill="#FFFFFF" stroke="${COLORS.ink}" stroke-width="8" stroke-linejoin="miter"/>
    </g>
  `;
}

function pixelFrame() {
  const inset = 16;
  return `
    <rect x="0" y="0" width="${WIDTH}" height="${HEIGHT}" fill="${COLORS.parchment}"/>
    <!-- subtle parchment grain via two-tone strips -->
    <rect x="0" y="0" width="${WIDTH}" height="${HEIGHT}" fill="url(#grain)" opacity="0.35"/>
    <!-- chunky pixel border -->
    <rect x="${inset}" y="${inset}" width="${WIDTH - inset * 2}" height="${HEIGHT - inset * 2}"
          fill="none" stroke="${COLORS.ink}" stroke-width="8"/>
    <!-- offset shadow corner ticks -->
    <rect x="${inset + 8}" y="${HEIGHT - inset}" width="${WIDTH - inset * 2 - 8}" height="8" fill="${COLORS.ink}"/>
    <rect x="${WIDTH - inset}" y="${inset + 8}" width="8" height="${HEIGHT - inset * 2 - 8}" fill="${COLORS.ink}"/>
  `;
}

function defs() {
  return `
    <defs>
      <pattern id="grain" patternUnits="userSpaceOnUse" width="4" height="4">
        <rect width="4" height="4" fill="${COLORS.parchment}"/>
        <rect width="2" height="2" fill="${COLORS.parchmentDeep}"/>
      </pattern>
    </defs>
  `;
}

function brandStrip() {
  return `
    <g>
      <text x="60" y="86" fill="${COLORS.ink}" font-family="'Courier New', monospace" font-size="22" font-weight="700" letter-spacing="4">
        ▶ GONGIDEAS · BLOG
      </text>
    </g>
  `;
}

function footerStrip(dateStr) {
  return `
    <g>
      <text x="60" y="${HEIGHT - 50}" fill="${COLORS.muted}" font-family="'Courier New', monospace" font-size="20" letter-spacing="3">
        gongideas.com  ·  ${escapeXml(dateStr)}
      </text>
    </g>
  `;
}

function buildSvg({ title, summary, date }) {
  const bulbyScale = 22;          // 16 * 22 = 352 wide; 20 * 22 = 440 tall
  const bulbyW = 16 * bulbyScale;
  const bulbyH = 20 * bulbyScale;
  const bulbyX = WIDTH - bulbyW - 80;
  const bulbyY = (HEIGHT - bulbyH) / 2 + 10;

  const bubbleX = 70;
  const bubbleY = 120;
  const bubbleW = bulbyX - bubbleX - 70;
  const bubbleH = HEIGHT - bubbleY - 110;
  const tailY = bubbleY + bubbleH * 0.55;

  // text wrapping — keep title short, summary fits below
  let titleLines = wrapText(title, 22);
  if (titleLines.length > 3) titleLines = wrapText(title, 26).slice(0, 3);
  let summaryLines = wrapText(summary, 42);
  // hard cap summary to keep within bubble
  const maxSummaryLines = titleLines.length >= 3 ? 2 : 3;
  if (summaryLines.length > maxSummaryLines) {
    summaryLines = summaryLines.slice(0, maxSummaryLines);
    const last = summaryLines[maxSummaryLines - 1];
    summaryLines[maxSummaryLines - 1] = last.replace(/[\s,.]*\S{0,8}$/, '') + '…';
  }

  const titleFontSize = titleLines.length >= 3 ? 40 : (titleLines.length === 2 ? 48 : 56);
  const titleLineH = titleFontSize * 1.2;
  const summaryFontSize = 24;
  const summaryLineH = summaryFontSize * 1.45;

  const padX = 48;
  const padY = 58;
  const titleStartY = bubbleY + padY + titleFontSize;
  const summaryStartY = titleStartY + (titleLines.length - 1) * titleLineH + 36 + summaryFontSize;

  const titleSvg = titleLines.map((ln, i) =>
    `<text x="${bubbleX + padX}" y="${titleStartY + i * titleLineH}" fill="${COLORS.ink}"
       font-family="'Helvetica Neue', 'Noto Sans Thai', sans-serif"
       font-size="${titleFontSize}" font-weight="800" letter-spacing="-0.5">${escapeXml(ln)}</text>`
  ).join('');

  const summarySvg = summaryLines.map((ln, i) =>
    `<text x="${bubbleX + padX}" y="${summaryStartY + i * summaryLineH}" fill="${COLORS.muted}"
       font-family="'Helvetica Neue', 'Noto Sans Thai', sans-serif"
       font-size="${summaryFontSize}" font-weight="400">${escapeXml(ln)}</text>`
  ).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  ${defs()}
  ${pixelFrame()}
  ${brandStrip()}
  ${speechBubble({ x: bubbleX, y: bubbleY, w: bubbleW, h: bubbleH, tailY })}
  ${titleSvg}
  ${summarySvg}
  ${bulbySvg(bulbyX, bulbyY, bulbyScale)}
  ${footerStrip(date)}
</svg>`;
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const files = (await fs.readdir(BLOG_DIR)).filter(f => f.endsWith('.md'));
  const summary = [];

  for (const file of files) {
    const slug = file.replace(/\.md$/, '');
    const raw = await fs.readFile(path.join(BLOG_DIR, file), 'utf8');
    const fm = parseFrontmatter(raw);
    if (!fm.title || !fm.summary) {
      console.warn(`! skipping ${file}: missing title/summary`);
      continue;
    }
    const dateStr = (fm.date || '').toString().slice(0, 10).replace(/-/g, '.');
    const svg = buildSvg({ title: fm.title, summary: fm.summary, date: dateStr });
    const outPath = path.join(OUT_DIR, `${slug}.png`);
    await sharp(Buffer.from(svg)).png().toFile(outPath);
    summary.push({ slug, outPath });
    console.log(`✓ ${slug} → public/og/${slug}.png`);
  }

  console.log(`\nGenerated ${summary.length} OG image(s).`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
