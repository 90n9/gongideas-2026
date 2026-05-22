#!/usr/bin/env node
// Generate OG images for blog posts: Bulby + speech bubble carrying the title.
// Output: public/og/<slug>.png (1200x630)

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import opentype from 'opentype.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const BLOG_DIR = path.join(ROOT, 'src/content/blog');
const OUT_DIR = path.join(ROOT, 'public/og');
const FONT_PATH = path.join(__dirname, 'fonts/PressStart2P-Regular.ttf');

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

// Word-wrap by character count (Press Start 2P is monospace).
function wrapByCols(text, cols) {
  const words = text.split(/\s+/);
  const lines = [];
  let buf = '';
  for (const w of words) {
    if (w.length > cols) {
      // hard-break long token
      if (buf) { lines.push(buf); buf = ''; }
      for (let i = 0; i < w.length; i += cols) lines.push(w.slice(i, i + cols));
      continue;
    }
    const candidate = buf ? buf + ' ' + w : w;
    if (candidate.length > cols) {
      lines.push(buf);
      buf = w;
    } else {
      buf = candidate;
    }
  }
  if (buf) lines.push(buf);
  return lines;
}

// Pick the largest font size such that wrapped title fits inside (boxW, boxH).
// Width is measured via opentype's actual glyph advance.
function fitTitle(font, text, boxW, boxH) {
  const lineHeightRatio = 1.5;
  for (let size = 56; size >= 18; size -= 2) {
    const cellW = font.getAdvanceWidth('M', size); // Press Start 2P is monospace
    const cellH = size * lineHeightRatio;
    const cols = Math.max(6, Math.floor(boxW / cellW));
    const lines = wrapByCols(text, cols);
    const widest = Math.max(...lines.map(l => font.getAdvanceWidth(l, size)));
    const blockH = lines.length * cellH;
    if (widest <= boxW && blockH <= boxH) {
      return { size, cellH, lines };
    }
  }
  // Fallback: smallest size, possibly clipped.
  const size = 18;
  const cellW = font.getAdvanceWidth('M', size);
  const cellH = size * lineHeightRatio;
  const cols = Math.max(4, Math.floor(boxW / cellW));
  return { size, cellH, lines: wrapByCols(text, cols) };
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

function brandStrip(font) {
  return textPath(font, 'GONGIDEAS / BLOG', 62, 86, 20, COLORS.ink);
}

function footerStrip(font, dateStr) {
  return textPath(font, `gongideas.com  ${dateStr}`, 62, HEIGHT - 50, 16, COLORS.muted);
}

function textPath(font, text, x, y, fontSize, fill) {
  if (!text) return '';
  const p = font.getPath(text, x, y, fontSize);
  return `<path d="${p.toPathData(2)}" fill="${fill}"/>`;
}

function textWidth(font, text, fontSize) {
  return font.getAdvanceWidth(text, fontSize);
}

function buildSvg({ title, date, font }) {
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

  // text box inside bubble
  const padX = 56;
  const padY = 56;
  const textBoxW = bubbleW - padX * 2;
  const textBoxH = bubbleH - padY * 2;

  const fit = fitTitle(font, title, textBoxW, textBoxH);
  const blockH = fit.lines.length * fit.cellH;
  // Vertically center the text block inside the bubble.
  const startY = bubbleY + (bubbleH - blockH) / 2 + fit.size;

  const titleSvg = fit.lines
    .map((ln, i) => textPath(font, ln, bubbleX + padX, startY + i * fit.cellH, fit.size, COLORS.ink))
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  ${defs()}
  ${pixelFrame()}
  ${brandStrip(font)}
  ${speechBubble({ x: bubbleX, y: bubbleY, w: bubbleW, h: bubbleH, tailY })}
  ${titleSvg}
  ${bulbySvg(bulbyX, bulbyY, bulbyScale)}
  ${footerStrip(font, date)}
</svg>`;
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const font = opentype.parse((await fs.readFile(FONT_PATH)).buffer);

  const files = (await fs.readdir(BLOG_DIR)).filter(f => f.endsWith('.md'));
  const summary = [];

  for (const file of files) {
    const slug = file.replace(/\.md$/, '');
    const raw = await fs.readFile(path.join(BLOG_DIR, file), 'utf8');
    const fm = parseFrontmatter(raw);
    if (!fm.title) {
      console.warn(`! skipping ${file}: missing title`);
      continue;
    }
    if (fm.draft === 'true' || fm.draft === true) {
      console.log(`· skipping ${file}: draft`);
      continue;
    }
    const dateStr = (fm.date || '').toString().slice(0, 10).replace(/-/g, '.');
    const svg = buildSvg({ title: fm.title, date: dateStr, font });
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
