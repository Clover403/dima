import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/* ============================================================================
 * MoneyFlow3D
 * ----------------------------------------------------------------------------
 * Arus uang 3D (uang kertas + koin) bergaya ilustrasi ukiran (engraving) navy &
 * tembaga, persis nuansa /foto/arus-uang2.png & video1 hero.
 *
 * - Uang mengalir diagonal (kiri-atas -> kanan-bawah) terus menerus.
 * - Kursor "menyibak" arus: item di dekat kursor terdorong, terseret searah
 *   gerak kursor, berputar, lalu perlahan kembali ke jalurnya (wake / trail).
 * - Saat kursor bergerak, muncul jejak uang + koin kecil yang ikut terseret
 *   lalu larut ke dalam arus.
 *
 * Semua tekstur digambar prosedural via Canvas2D (tanpa aset tambahan) dan
 * dirender memakai InstancedMesh agar ringan.
 * ========================================================================== */

const INK = '#211e5a';
const INK_SOFT = 'rgba(33, 30, 90, ';

// ---------------------------------------------------------------------------
// Utils
// ---------------------------------------------------------------------------
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

function roundRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

function hatch(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, step: number, angle: number, color: string, lw = 1) {
  g.save();
  g.strokeStyle = color;
  g.lineWidth = lw;
  const cx = x + w / 2;
  const cy = y + h / 2;
  const len = Math.hypot(w, h);
  g.translate(cx, cy);
  g.rotate(angle);
  g.beginPath();
  for (let i = -len / 2; i <= len / 2; i += step) {
    g.moveTo(-len / 2, i);
    g.lineTo(len / 2, i);
  }
  g.stroke();
  g.restore();
}

function rosette(g: CanvasRenderingContext2D, cx: number, cy: number, R: number, petals: number, layers: number, alpha: number, lw = 1.2) {
  g.save();
  g.lineWidth = lw;
  for (let L = 0; L < layers; L++) {
    const r0 = R * (1 - L * (0.55 / layers));
    g.strokeStyle = `${INK_SOFT}${alpha * (1 - L * 0.04)})`;
    g.beginPath();
    for (let i = 0; i <= 360; i++) {
      const a = (i / 360) * Math.PI * 2;
      const rr = r0 * (0.74 + 0.26 * Math.cos(petals * a + L * 0.55));
      const x = cx + Math.cos(a) * rr;
      const y = cy + Math.sin(a) * rr;
      if (i === 0) g.moveTo(x, y);
      else g.lineTo(x, y);
    }
    g.closePath();
    g.stroke();
  }
  g.restore();
}

// ---------------------------------------------------------------------------
// Bill painter
// ---------------------------------------------------------------------------
interface BillDesign {
  id: 'euro100' | 'euro20' | 'yen1000';
  denom: string;
  seed: number;
}

const BILL_DESIGNS: BillDesign[] = [
  { id: 'euro100', denom: '100', seed: 42 },
  { id: 'euro20', denom: '20', seed: 77 },
  { id: 'yen1000', denom: '1000', seed: 99 },
];

const BILL_W = 1024;
const BILL_H = 466; // aspect ~2.2 (matches plane geometry)

// ---------------------------------------------------------------------------
// Yen banknote image preloader
// ---------------------------------------------------------------------------
let cachedYenImg: HTMLImageElement | null = null;
let yenImgRequested = false;

function preloadYenImage(onLoaded?: () => void) {
  if (typeof window === 'undefined') return;
  if (cachedYenImg && cachedYenImg.complete && cachedYenImg.naturalWidth > 0) {
    if (onLoaded) onLoaded();
    return;
  }
  if (yenImgRequested) {
    if (cachedYenImg && onLoaded) {
      cachedYenImg.addEventListener('load', onLoaded, { once: true });
    }
    return;
  }
  yenImgRequested = true;
  const img = new Image();
  img.src = '/foto/yen1000-enhanced.png';
  img.onload = () => {
    cachedYenImg = img;
    if (onLoaded) onLoaded();
  };
  img.onerror = () => {
    const fallback = new Image();
    fallback.src = '/foto/yen1000-clean.png';
    fallback.onload = () => {
      cachedYenImg = fallback;
      if (onLoaded) onLoaded();
    };
  };
}

function drawStar(g: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerR: number, innerR: number, fill = false) {
  let rot = (Math.PI / 2) * 3;
  const step = Math.PI / spikes;
  g.beginPath();
  g.moveTo(cx, cy - outerR);
  for (let i = 0; i < spikes; i++) {
    let x = cx + Math.cos(rot) * outerR;
    let y = cy + Math.sin(rot) * outerR;
    g.lineTo(x, y);
    rot += step;
    x = cx + Math.cos(rot) * innerR;
    y = cy + Math.sin(rot) * innerR;
    g.lineTo(x, y);
    rot += step;
  }
  g.lineTo(cx, cy - outerR);
  g.closePath();
  if (fill) {
    g.fillStyle = INK;
    g.fill();
  } else {
    g.strokeStyle = INK;
    g.lineWidth = 1.3;
    g.stroke();
  }
}

function drawEuroArch(g: CanvasRenderingContext2D, cx: number, cy: number, w: number, h: number) {
  g.save();
  g.strokeStyle = INK;
  g.lineWidth = 2.4;

  const topY = cy - h * 0.44;
  const botY = cy + h * 0.46;

  // Triangular Classical Pediment with dentil moldings
  g.beginPath();
  g.moveTo(cx - w * 0.52, topY + 16);
  g.lineTo(cx, topY - 26);
  g.lineTo(cx + w * 0.52, topY + 16);
  g.closePath();
  g.stroke();

  // Pediment inner line & dentils
  g.lineWidth = 1.4;
  g.beginPath();
  g.moveTo(cx - w * 0.46, topY + 13);
  g.lineTo(cx, topY - 20);
  g.lineTo(cx + w * 0.46, topY + 13);
  g.stroke();

  // Central rosette medallion in the pediment
  rosette(g, cx, topY - 3, 11, 8, 2, 0.4, 1);

  // Pediment tympanum hatch
  hatch(g, cx - w * 0.45, topY - 18, w * 0.9, 30, 4, 0, `${INK_SOFT}0.25)`);

  // Entablature (architrave & frieze beam)
  g.lineWidth = 2.4;
  g.strokeRect(cx - w * 0.53, topY + 16, w * 1.06, 22);
  hatch(g, cx - w * 0.51, topY + 18, w * 1.02, 18, 4.2, Math.PI / 4, `${INK_SOFT}0.35)`);

  // Side Columns / Pilasters with Corinthian capitals
  const colW = w * 0.16;
  // Left column
  g.strokeRect(cx - w * 0.50, topY + 38, colW, botY - (topY + 38));
  // Capital acanthus leaf bracket
  g.strokeRect(cx - w * 0.52, topY + 38, colW + 8, 12);
  for (let c = 1; c <= 3; c++) {
    const fx = cx - w * 0.50 + c * (colW / 4);
    g.beginPath();
    g.moveTo(fx, topY + 54);
    g.lineTo(fx, botY - 10);
    g.stroke();
  }
  // Right column
  g.strokeRect(cx + w * 0.50 - colW, topY + 38, colW, botY - (topY + 38));
  // Capital acanthus leaf bracket
  g.strokeRect(cx + w * 0.50 - colW - 4, topY + 38, colW + 8, 12);
  for (let c = 1; c <= 3; c++) {
    const fx = cx + w * 0.50 - colW + c * (colW / 4);
    g.beginPath();
    g.moveTo(fx, topY + 54);
    g.lineTo(fx, botY - 10);
    g.stroke();
  }

  // Central round archway
  const archW = w * 0.52;
  const archSpringY = cy + h * 0.05;
  const archR = archW / 2;

  g.lineWidth = 3.2;
  g.beginPath();
  g.moveTo(cx - archR, botY);
  g.lineTo(cx - archR, archSpringY);
  g.arc(cx, archSpringY, archR, Math.PI, 0);
  g.lineTo(cx + archR, botY);
  g.stroke();

  // Inner arch line
  const innerR = archR - 18;
  g.lineWidth = 1.8;
  g.beginPath();
  g.moveTo(cx - innerR, botY);
  g.lineTo(cx - innerR, archSpringY);
  g.arc(cx, archSpringY, innerR, Math.PI, 0);
  g.lineTo(cx + innerR, botY);
  g.stroke();

  // Arch radial stones (voussoirs)
  for (let i = 0; i <= 12; i++) {
    const a = Math.PI + (i / 12) * Math.PI;
    g.beginPath();
    g.moveTo(cx + Math.cos(a) * innerR, archSpringY + Math.sin(a) * innerR);
    g.lineTo(cx + Math.cos(a) * archR, archSpringY + Math.sin(a) * archR);
    g.stroke();
  }

  // Central keystone
  g.lineWidth = 2.4;
  g.strokeRect(cx - 13, archSpringY - archR - 15, 26, 26);
  hatch(g, cx - 11, archSpringY - archR - 13, 22, 22, 3, 0, `${INK_SOFT}0.4)`);

  // Interior barrel vault perspective lines (adds deep 3D perspective to archway)
  g.save();
  g.beginPath();
  g.moveTo(cx - innerR, botY);
  g.lineTo(cx - innerR, archSpringY);
  g.arc(cx, archSpringY, innerR, Math.PI, 0);
  g.lineTo(cx + innerR, botY);
  g.closePath();
  g.clip();
  hatch(g, cx - innerR, archSpringY - innerR, innerR * 2, botY - (archSpringY - innerR), 6, -0.4, `${INK_SOFT}0.18)`);
  // Deep ceiling rings
  for (let rStep = 1; rStep <= 3; rStep++) {
    const rL = innerR - rStep * 20;
    if (rL > 10) {
      g.strokeStyle = `${INK_SOFT}0.22)`;
      g.beginPath();
      g.arc(cx, archSpringY + rStep * 15, rL, Math.PI, 0);
      g.stroke();
    }
  }
  g.restore();

  // Spandrel hatch
  g.save();
  g.beginPath();
  g.rect(cx - w * 0.50, topY + 38, w * 1.00, archSpringY - topY);
  g.arc(cx, archSpringY, archR, 0, Math.PI, true);
  g.closePath();
  g.clip();
  hatch(g, cx - w * 0.50, topY + 38, w * 1.00, 130, 4.5, -Math.PI / 4, `${INK_SOFT}0.35)`);
  g.restore();

  // Pedestal base steps
  g.lineWidth = 2.4;
  g.strokeRect(cx - w * 0.56, botY, w * 1.12, 14);
  g.strokeRect(cx - w * 0.60, botY + 14, w * 1.20, 10);
  hatch(g, cx - w * 0.56, botY, w * 1.12, 14, 4, 0, `${INK_SOFT}0.3)`);

  g.restore();
}

function drawGothicWindow(g: CanvasRenderingContext2D, cx: number, cy: number, w: number, h: number) {
  g.save();
  g.strokeStyle = INK;
  g.lineWidth = 2.4;

  const topY = cy - h * 0.46;
  const botY = cy + h * 0.44;
  const halfW = w * 0.38;
  const leftX = cx - halfW;
  const rightX = cx + halfW;
  const springY = cy - h * 0.04;

  // Triangular gable overhead with decorative crockets
  g.beginPath();
  g.moveTo(leftX - 16, springY);
  g.lineTo(cx, topY - 32);
  g.lineTo(rightX + 16, springY);
  g.stroke();
  // Finial cross at gable apex
  g.beginPath();
  g.moveTo(cx, topY - 32);
  g.lineTo(cx, topY - 48);
  g.moveTo(cx - 7, topY - 40);
  g.lineTo(cx + 7, topY - 40);
  g.stroke();

  // Outer Pointed Arch
  g.lineWidth = 3.2;
  g.beginPath();
  g.moveTo(leftX, botY);
  g.lineTo(leftX, springY);
  g.quadraticCurveTo(leftX, topY + (springY - topY) * 0.22, cx, topY);
  g.quadraticCurveTo(rightX, topY + (springY - topY) * 0.22, rightX, springY);
  g.lineTo(rightX, botY);
  g.stroke();

  // Secondary moulding line
  g.lineWidth = 1.6;
  g.beginPath();
  g.moveTo(leftX + 8, botY);
  g.lineTo(leftX + 8, springY);
  g.quadraticCurveTo(leftX + 8, topY + 14 + (springY - topY) * 0.22, cx, topY + 14);
  g.quadraticCurveTo(rightX - 8, topY + 14 + (springY - topY) * 0.22, rightX - 8, springY);
  g.lineTo(rightX - 8, botY);
  g.stroke();

  // Twin sub-lancets (inner twin pointed arches)
  const midX = cx;
  const subLancetApex = topY + (botY - topY) * 0.36;
  g.lineWidth = 2.0;

  // Left sub-arch
  g.beginPath();
  g.moveTo(leftX + 14, botY);
  g.lineTo(leftX + 14, springY);
  g.quadraticCurveTo(leftX + 14, subLancetApex + 20, (leftX + midX) / 2, subLancetApex);
  g.quadraticCurveTo(midX - 7, subLancetApex + 20, midX - 7, springY);
  g.lineTo(midX - 7, botY);
  g.stroke();

  // Right sub-arch
  g.beginPath();
  g.moveTo(midX + 7, botY);
  g.lineTo(midX + 7, springY);
  g.quadraticCurveTo(midX + 7, subLancetApex + 20, (midX + rightX) / 2, subLancetApex);
  g.quadraticCurveTo(rightX - 14, subLancetApex + 20, rightX - 14, springY);
  g.lineTo(rightX - 14, botY);
  g.stroke();

  // Rose window / circular tracery in the tympanum
  const roseR = (halfW - 14) * 0.44;
  const roseY = topY + (subLancetApex - topY) * 0.58;
  g.lineWidth = 2.2;
  g.beginPath();
  g.arc(cx, roseY, roseR, 0, Math.PI * 2);
  g.stroke();

  // 6 foils inside the rose window
  for (let k = 0; k < 6; k++) {
    const a = (k / 6) * Math.PI * 2;
    const petX = cx + Math.cos(a) * (roseR * 0.55);
    const petY = roseY + Math.sin(a) * (roseR * 0.55);
    g.beginPath();
    g.arc(petX, petY, roseR * 0.38, 0, Math.PI * 2);
    g.stroke();
  }

  // Side colonnettes
  g.lineWidth = 1.8;
  g.strokeRect(leftX - 10, springY, 6, botY - springY);
  g.strokeRect(rightX + 4, springY, 6, botY - springY);

  // Base sill steps
  g.lineWidth = 2.4;
  g.strokeRect(leftX - 18, botY, halfW * 2 + 36, 12);
  g.strokeRect(leftX - 26, botY + 12, halfW * 2 + 52, 8);

  // Spandrel stone masonry hatch
  hatch(g, leftX - 14, topY - 10, halfW * 2 + 28, 60, 4.5, -Math.PI / 4, `${INK_SOFT}0.25)`);

  g.restore();
}

function drawNoguchiPortrait(g: CanvasRenderingContext2D, px: number, py: number, rx: number, ry: number) {
  g.save();
  // 1. Oval cameo background with delicate banknote hatch
  g.beginPath();
  g.ellipse(px, py, rx, ry, 0, 0, Math.PI * 2);
  g.fillStyle = '#ffffff';
  g.fill();
  hatch(g, px - rx, py - ry, rx * 2, ry * 2, 4.5, 0, `${INK_SOFT}0.16)`);

  // 2. Shoulders & dark engraved suit coat
  g.beginPath();
  g.moveTo(px - rx * 1.15, py + ry * 1.05);
  g.bezierCurveTo(px - rx * 0.95, py + ry * 0.45, px - rx * 0.5, py + ry * 0.38, px - rx * 0.16, py + ry * 0.36);
  g.lineTo(px + rx * 0.16, py + ry * 0.36);
  g.bezierCurveTo(px + rx * 0.5, py + ry * 0.38, px + rx * 0.95, py + ry * 0.45, px + rx * 1.15, py + ry * 1.05);
  g.closePath();
  g.save();
  g.clip();
  g.fillStyle = '#ffffff';
  g.fill();
  hatch(g, px - rx * 1.2, py, rx * 2.4, ry * 1.2, 2.8, -0.65, `${INK_SOFT}0.9)`, 1.3);
  hatch(g, px - rx * 1.2, py, rx * 2.4, ry * 1.2, 3.8, 0.55, `${INK_SOFT}0.55)`, 1.1);
  g.restore();
  g.strokeStyle = INK;
  g.lineWidth = 2.6;
  g.stroke();

  // 3. High white shirt collar & necktie
  g.beginPath();
  g.moveTo(px - rx * 0.22, py + ry * 0.36);
  g.lineTo(px, py + ry * 0.76);
  g.lineTo(px + rx * 0.22, py + ry * 0.36);
  g.closePath();
  g.fillStyle = '#ffffff';
  g.fill();
  g.stroke();

  // Necktie
  g.beginPath();
  g.moveTo(px - 5, py + ry * 0.45);
  g.lineTo(px + 5, py + ry * 0.45);
  g.lineTo(px + 8, py + ry * 0.85);
  g.lineTo(px, py + ry * 1.0);
  g.lineTo(px - 8, py + ry * 0.85);
  g.closePath();
  g.fillStyle = INK;
  g.fill();

  // Neck
  g.fillStyle = '#ffffff';
  g.fillRect(px - rx * 0.18, py + ry * 0.08, rx * 0.36, ry * 0.30);
  g.beginPath();
  g.moveTo(px - rx * 0.18, py + ry * 0.08);
  g.lineTo(px - rx * 0.18, py + ry * 0.38);
  g.moveTo(px + rx * 0.18, py + ry * 0.08);
  g.lineTo(px + rx * 0.18, py + ry * 0.38);
  g.stroke();

  // 4. Head & Hideyo Noguchi hairstyle
  const hx = px;
  const hy = py - ry * 0.18;
  const hrx = rx * 0.42;
  const hry = ry * 0.44;
  g.beginPath();
  g.ellipse(hx, hy, hrx, hry, 0, 0, Math.PI * 2);
  g.fillStyle = '#ffffff';
  g.fill();
  g.save();
  g.clip();
  // Face shadow hatch
  g.beginPath();
  g.rect(hx - hrx, hy - hry, hrx * 0.85, hry * 2);
  g.clip();
  hatch(g, hx - hrx, hy - hry, hrx * 2, hry * 2, 3.2, 0.3, `${INK_SOFT}0.38)`, 1);
  g.restore();

  // Voluminous side-parted hair
  g.save();
  g.beginPath();
  g.ellipse(hx, hy, hrx, hry, 0, 0, Math.PI * 2);
  g.clip();
  g.beginPath();
  g.moveTo(hx - hrx * 1.05, hy);
  g.bezierCurveTo(hx - hrx * 0.8, hy - hry * 0.6, hx - hrx * 0.2, hy - hry * 0.85, hx + hrx * 0.15, hy - hry * 0.55);
  g.bezierCurveTo(hx + hrx * 0.5, hy - hry * 0.75, hx + hrx * 0.9, hy - hry * 0.5, hx + hrx * 1.05, hy);
  g.lineTo(hx + hrx * 1.1, hy - hry * 1.2);
  g.lineTo(hx - hrx * 1.1, hy - hry * 1.2);
  g.closePath();
  g.clip();
  hatch(g, hx - hrx, hy - hry * 1.2, hrx * 2, hry * 1.4, 2.2, -0.3, `${INK_SOFT}0.92)`, 1.3);
  hatch(g, hx - hrx, hy - hry * 1.2, hrx * 2, hry * 1.4, 3.5, 0.4, `${INK_SOFT}0.55)`, 1.1);
  g.restore();

  g.strokeStyle = INK;
  g.lineWidth = 2.4;
  g.beginPath();
  g.ellipse(hx, hy, hrx, hry, 0, 0, Math.PI * 2);
  g.stroke();

  // Face features (eyebrows, eyes, nose, signature mustache, mouth)
  g.lineWidth = 1.8;
  g.beginPath();
  // Eyebrows
  g.moveTo(hx - hrx * 0.6, hy - hry * 0.08);
  g.lineTo(hx - hrx * 0.18, hy - hry * 0.12);
  g.moveTo(hx + hrx * 0.18, hy - hry * 0.12);
  g.lineTo(hx + hrx * 0.6, hy - hry * 0.08);
  // Eyes
  g.moveTo(hx - hrx * 0.5, hy + hry * 0.04);
  g.lineTo(hx - hrx * 0.22, hy + hry * 0.04);
  g.moveTo(hx + hrx * 0.22, hy + hry * 0.04);
  g.lineTo(hx + hrx * 0.5, hy + hry * 0.04);
  // Nose
  g.moveTo(hx, hy + hry * 0.05);
  g.lineTo(hx + 3, hy + hry * 0.32);
  g.lineTo(hx - 5, hy + hry * 0.36);
  // Characteristic mustache
  g.moveTo(hx - hrx * 0.35, hy + hry * 0.52);
  g.quadraticCurveTo(hx, hy + hry * 0.46, hx + hrx * 0.35, hy + hry * 0.52);
  // Mouth
  g.moveTo(hx - hrx * 0.25, hy + hry * 0.66);
  g.quadraticCurveTo(hx, hy + hry * 0.72, hx + hrx * 0.25, hy + hry * 0.66);
  g.stroke();

  // 5. Oval frame rings
  g.strokeStyle = INK;
  g.lineWidth = 3.0;
  g.beginPath();
  g.ellipse(px, py, rx, ry, 0, 0, Math.PI * 2);
  g.stroke();
  g.lineWidth = 1.2;
  g.beginPath();
  g.ellipse(px, py, rx + 6, ry + 6, 0, 0, Math.PI * 2);
  g.stroke();

  g.restore();
}

function paintEuro100(g: CanvasRenderingContext2D, W: number, H: number) {
  const sans = '"Inter Tight", "Helvetica Neue", Arial, sans-serif';

  // 1. Pure crisp white paper background (kertas putih bersih)
  g.fillStyle = '#ffffff';
  g.fillRect(0, 0, W, H);

  // 2. Subtle background engraving hatch & constellation stars
  hatch(g, 0, 0, W, H, 8, Math.PI / 4, `${INK_SOFT}0.04)`);
  hatch(g, 0, 0, W, H, 8, -Math.PI / 4, `${INK_SOFT}0.02)`);

  const starCoords = [
    [170, 140], [220, 190], [260, 145], [195, 245], [280, 230],
    [330, 180], [360, 250], [240, 310], [310, 330], [180, 330]
  ];
  starCoords.forEach(([sx, sy]) => {
    drawStar(g, sx, sy, 5, 8.5, 3.8);
  });

  // 3. Double engraved frame border with rounded corners
  g.strokeStyle = INK;
  g.lineWidth = 6;
  roundRect(g, 8, 8, W - 16, H - 16, 12);
  g.stroke();
  g.lineWidth = 1.6;
  roundRect(g, 22, 22, W - 44, H - 44, 6);
  g.stroke();

  // Corner micro rosettes
  [[34, 34], [W - 34, 34], [34, H - 34], [W - 34, H - 34]].forEach(([cx, cy]) => {
    rosette(g, cx, cy, 14, 8, 3, 0.45, 1);
  });

  // 4. Top Header: ECB Acronyms
  g.fillStyle = INK;
  g.font = `700 13px ${sans}`;
  g.textAlign = 'left';
  g.fillText('BCE · ECB · ЕЦБ · EZB · EKP · EKT · EKB · BĊE · EBC', 180, 42);

  // 5. Top-left: EU Flag rectangle with circle of 12 stars
  const flagX = 66;
  const flagY = 48;
  const flagW = 92;
  const flagH = 58;
  g.strokeStyle = INK;
  g.lineWidth = 2.4;
  g.strokeRect(flagX, flagY, flagW, flagH);
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const stx = flagX + flagW / 2 + Math.cos(a) * 18;
    const sty = flagY + flagH / 2 + Math.sin(a) * 18;
    drawStar(g, stx, sty, 5, 3.8, 1.6, true);
  }
  // President signature below flag
  g.beginPath();
  g.moveTo(flagX + 6, flagY + flagH + 16);
  g.bezierCurveTo(flagX + 24, flagY + flagH + 6, flagX + 44, flagY + flagH + 24, flagX + 60, flagY + flagH + 12);
  g.bezierCurveTo(flagX + 75, flagY + flagH + 2, flagX + 85, flagY + flagH + 20, flagX + 92, flagY + flagH + 14);
  g.lineWidth = 1.8;
  g.stroke();
  g.font = `600 10px ${sans}`;
  g.fillStyle = `${INK_SOFT}0.7)`;
  g.fillText('PRESIDENT', flagX + 18, flagY + flagH + 28);

  // 6. Center: Classical Baroque Arch gateway
  drawEuroArch(g, W * 0.60, H * 0.55, 270, 290);

  // 7. Security Holographic Foil Strip on the right
  const stripX = W * 0.79;
  const stripW = 46;
  g.fillStyle = 'rgba(235, 238, 248, 0.45)';
  g.fillRect(stripX, 22, stripW, H - 44);
  g.strokeStyle = `${INK_SOFT}0.25)`;
  g.lineWidth = 1.2;
  g.strokeRect(stripX, 22, stripW, H - 44);
  for (let y = 50; y < H - 50; y += 46) {
    g.fillStyle = `${INK_SOFT}0.5)`;
    g.font = `800 16px ${sans}`;
    g.textAlign = 'center';
    g.fillText('100', stripX + stripW / 2, y);
    g.fillText('€', stripX + stripW / 2, y + 20);
    drawStar(g, stripX + stripW / 2, y + 32, 5, 4, 1.8);
  }

  // Rosette seal next to arch
  rosette(g, W * 0.90, H * 0.50, 42, 10, 7, 0.45, 1.2);

  // 8. Top-right: Large bold "100", slightly angled
  g.save();
  g.translate(W - 85, 145);
  g.rotate(-0.055);
  g.fillStyle = INK;
  g.font = `900 156px ${sans}`;
  g.textAlign = 'right';
  g.textBaseline = 'alphabetic';
  g.fillText('100', 0, 0);
  g.restore();

  // 9. Bottom-left: Teks "100 EURO"
  g.fillStyle = INK;
  g.textAlign = 'left';
  g.textBaseline = 'alphabetic';
  g.font = `900 52px ${sans}`;
  g.fillText('100', 66, H - 64);
  g.font = `900 36px ${sans}`;
  g.fillText('EURO', 174, H - 64);
  g.font = `700 14px ${sans}`;
  g.fillStyle = `${INK_SOFT}0.8)`;
  g.fillText('ΕΥΡΩ · ЕВРО · EURO', 66, H - 40);

  // Micro serial
  g.font = `700 16px "Courier New", monospace`;
  g.fillStyle = INK;
  g.fillText('S 0 0 9 1 7 7 2 5 8 4', W * 0.36, H - 42);

  // Micro barcode pattern along bottom
  for (let b = 0; b < 24; b++) {
    const bx = W * 0.36 + b * 6.5;
    const bh = (b % 3 === 0) ? 14 : 9;
    g.fillRect(bx, H - 32, (b % 2 === 0) ? 2.5 : 1.2, bh);
  }
}

function paintEuro20(g: CanvasRenderingContext2D, W: number, H: number) {
  const sans = '"Inter Tight", "Helvetica Neue", Arial, sans-serif';

  // 1. Pure crisp white paper background (kertas putih bersih)
  g.fillStyle = '#ffffff';
  g.fillRect(0, 0, W, H);

  // 2. Subtle background engraving & constellation stars
  hatch(g, 0, 0, W, H, 8, Math.PI / 4, `${INK_SOFT}0.04)`);
  hatch(g, 0, 0, W, H, 8, -Math.PI / 4, `${INK_SOFT}0.02)`);

  const starCoords = [
    [160, 140], [210, 185], [250, 140], [185, 240], [270, 225],
    [320, 180], [350, 245], [230, 300], [300, 320], [170, 320]
  ];
  starCoords.forEach(([sx, sy]) => {
    drawStar(g, sx, sy, 5, 8.5, 3.8);
  });

  // 3. Double border with rounded corners
  g.strokeStyle = INK;
  g.lineWidth = 6;
  roundRect(g, 8, 8, W - 16, H - 16, 12);
  g.stroke();
  g.lineWidth = 1.6;
  roundRect(g, 22, 22, W - 44, H - 44, 6);
  g.stroke();

  // Corner micro rosettes
  [[34, 34], [W - 34, 34], [34, H - 34], [W - 34, H - 34]].forEach(([cx, cy]) => {
    rosette(g, cx, cy, 14, 8, 3, 0.45, 1);
  });

  // 4. Top Header: ECB Acronyms
  g.fillStyle = INK;
  g.font = `700 13px ${sans}`;
  g.textAlign = 'left';
  g.fillText('BCE · ECB · ЕЦБ · EZB · EKP · EKT · EKB · BĊE · EBC', 180, 42);

  // 5. Top-left: EU Flag rectangle with circle of 12 stars
  const flagX = 66;
  const flagY = 48;
  const flagW = 92;
  const flagH = 58;
  g.strokeStyle = INK;
  g.lineWidth = 2.4;
  g.strokeRect(flagX, flagY, flagW, flagH);
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const stx = flagX + flagW / 2 + Math.cos(a) * 18;
    const sty = flagY + flagH / 2 + Math.sin(a) * 18;
    drawStar(g, stx, sty, 5, 3.8, 1.6, true);
  }
  // Signature
  g.beginPath();
  g.moveTo(flagX + 6, flagY + flagH + 16);
  g.bezierCurveTo(flagX + 24, flagY + flagH + 6, flagX + 44, flagY + flagH + 24, flagX + 60, flagY + flagH + 12);
  g.bezierCurveTo(flagX + 75, flagY + flagH + 2, flagX + 85, flagY + flagH + 20, flagX + 92, flagY + flagH + 14);
  g.lineWidth = 1.8;
  g.stroke();
  g.font = `600 10px ${sans}`;
  g.fillStyle = `${INK_SOFT}0.7)`;
  g.fillText('PRESIDENT', flagX + 18, flagY + flagH + 28);

  // 6. Center: Gothic Architectural Window (ciri khas uang €20)
  drawGothicWindow(g, W * 0.60, H * 0.55, 270, 290);

  // 7. Security Holographic Foil Strip on the right
  const stripX = W * 0.79;
  const stripW = 46;
  g.fillStyle = 'rgba(235, 238, 248, 0.45)';
  g.fillRect(stripX, 22, stripW, H - 44);
  g.strokeStyle = `${INK_SOFT}0.25)`;
  g.lineWidth = 1.2;
  g.strokeRect(stripX, 22, stripW, H - 44);
  for (let y = 50; y < H - 50; y += 46) {
    g.fillStyle = `${INK_SOFT}0.5)`;
    g.font = `800 16px ${sans}`;
    g.textAlign = 'center';
    g.fillText('20', stripX + stripW / 2, y);
    g.fillText('€', stripX + stripW / 2, y + 20);
    drawStar(g, stripX + stripW / 2, y + 32, 5, 4, 1.8);
  }

  // Rosette seal next to window
  rosette(g, W * 0.90, H * 0.50, 42, 10, 7, 0.45, 1.2);

  // 8. Top-right: Large bold "20", slightly angled
  g.save();
  g.translate(W - 85, 145);
  g.rotate(-0.055);
  g.fillStyle = INK;
  g.font = `900 160px ${sans}`;
  g.textAlign = 'right';
  g.textBaseline = 'alphabetic';
  g.fillText('20', 0, 0);
  g.restore();

  // 9. Bottom-left: Teks "20 EURO"
  g.fillStyle = INK;
  g.textAlign = 'left';
  g.textBaseline = 'alphabetic';
  g.font = `900 52px ${sans}`;
  g.fillText('20', 66, H - 64);
  g.font = `900 36px ${sans}`;
  g.fillText('EURO', 152, H - 64);
  g.font = `700 14px ${sans}`;
  g.fillStyle = `${INK_SOFT}0.8)`;
  g.fillText('ΕΥΡΩ · ЕВРО · EURO', 66, H - 40);

  // Micro serial
  g.font = `700 16px "Courier New", monospace`;
  g.fillStyle = INK;
  g.fillText('U 2 0 8 4 9 1 3 6 5 2', W * 0.36, H - 42);

  // Micro barcode pattern along bottom
  for (let b = 0; b < 24; b++) {
    const bx = W * 0.36 + b * 6.5;
    const bh = (b % 3 === 0) ? 14 : 9;
    g.fillRect(bx, H - 32, (b % 2 === 0) ? 2.5 : 1.2, bh);
  }
}

function paintYen1000(g: CanvasRenderingContext2D, W: number, H: number) {
  // If photographic high-res banknote image is loaded, draw it directly!
  if (cachedYenImg && cachedYenImg.complete && cachedYenImg.naturalWidth > 0) {
    g.fillStyle = '#faf6ec';
    g.fillRect(0, 0, W, H);
    g.drawImage(cachedYenImg, 0, 0, W, H);
    // Crisp outer intaglio border
    g.strokeStyle = INK;
    g.lineWidth = 3;
    roundRect(g, 4, 4, W - 8, H - 8, 8);
    g.stroke();
    return;
  }

  // Fallback procedural authentic 1000 Yen design
  const sans = '"Inter Tight", "Helvetica Neue", Arial, sans-serif';
  const mincho = '"Yu Mincho", "MS Mincho", "Hiragino Mincho Pro", "Noto Serif JP", serif';

  // 1. Traditional soft washi paper background ("kecuali yen")
  g.fillStyle = '#faf6ec';
  g.fillRect(0, 0, W, H);

  // Subtle warm paper wash
  const rg = g.createRadialGradient(W * 0.5, H * 0.5, 20, W * 0.5, H * 0.5, W * 0.5);
  rg.addColorStop(0, 'rgba(238, 228, 210, 0.28)');
  rg.addColorStop(1, 'rgba(250, 246, 236, 0)');
  g.fillStyle = rg;
  g.fillRect(0, 0, W, H);

  // 2. Fine background engraving hatch & geometric banknote waves
  hatch(g, 0, 0, W, H, 8, Math.PI / 4, `${INK_SOFT}0.045)`);
  g.lineWidth = 1;
  for (let k = 0; k < 6; k++) {
    g.strokeStyle = `${INK_SOFT}${0.10 + (k % 3) * 0.025})`;
    g.beginPath();
    for (let x = 30; x <= W - 30; x += 5) {
      const y = H * 0.88 + Math.sin(x * 0.03 + k * 0.7) * 7 + k * 1.5 - 6;
      if (x === 30) g.moveTo(x, y);
      else g.lineTo(x, y);
    }
    g.stroke();
  }

  // 3. Double borders with rounded corners
  g.strokeStyle = INK;
  g.lineWidth = 6;
  roundRect(g, 8, 8, W - 16, H - 16, 12);
  g.stroke();
  g.lineWidth = 1.6;
  roundRect(g, 22, 22, W - 44, H - 44, 6);
  g.stroke();

  // 4. Central iconic white watermark window (lingkaran/oval putih khas uang Yen)
  g.save();
  g.fillStyle = '#ffffff';
  g.beginPath();
  g.ellipse(W * 0.46, H * 0.50, 95, 135, 0, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = `${INK_SOFT}0.35)`;
  g.lineWidth = 1.6;
  g.stroke();
  rosette(g, W * 0.46, H * 0.50, 108, 12, 3, 0.22, 1);
  g.restore();

  // 5. Left Section: Japanese Banknote denominations & calligraphy
  // Top-left numeral: "1000"
  g.fillStyle = INK;
  g.textAlign = 'left';
  g.textBaseline = 'alphabetic';
  g.font = `900 56px ${sans}`;
  g.fillText('1000', 58, 86);
  g.font = `700 13px ${sans}`;
  g.fillStyle = `${INK_SOFT}0.75)`;
  g.fillText('NIPPON GINKO', 58, 108);

  // Bank of Japan official header: "日本銀行券"
  g.fillStyle = INK;
  g.font = `700 24px ${mincho}`;
  g.fillText('日本銀行券', 58, 148);

  // Large Kanji denomination: "千円"
  g.font = `900 72px ${mincho}`;
  g.fillText('千円', 58, 234);

  // Official Governor Seal Stamp (stempel segel merah vermilion di kiri bawah)
  const sealX = 115;
  const sealY = H - 95;
  const sealR = 25;
  g.save();
  g.strokeStyle = '#b93b2a';
  g.lineWidth = 2.4;
  g.beginPath();
  g.arc(sealX, sealY, sealR, 0, Math.PI * 2);
  g.stroke();
  g.lineWidth = 1;
  g.beginPath();
  g.arc(sealX, sealY, sealR - 4, 0, Math.PI * 2);
  g.stroke();
  g.fillStyle = '#b93b2a';
  g.font = `900 12px ${mincho}`;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText('総裁', sealX, sealY - 6);
  g.fillText('之印', sealX, sealY + 7);
  g.restore();

  // Serial number (matching user's photo)
  g.font = `700 17px "Courier New", monospace`;
  g.fillStyle = INK;
  g.textAlign = 'left';
  g.fillText('GZ 641400 G', 58, H - 42);

  // 6. Right Section: Corner numerals & Hideyo Noguchi portrait
  // Top-right "1000"
  g.fillStyle = INK;
  g.textAlign = 'right';
  g.font = `900 56px ${sans}`;
  g.fillText('1000', W - 58, 86);

  // Bottom-right "1000"
  g.font = `700 36px ${sans}`;
  g.fillText('1000', W - 58, H - 42);

  // Engraved portrait of Hideyo Noguchi
  drawNoguchiPortrait(g, W * 0.76, H * 0.52, W * 0.125, H * 0.35);

  // Bottom microtext
  g.font = `600 11px ${mincho}`;
  g.fillStyle = `${INK_SOFT}0.7)`;
  g.textAlign = 'center';
  g.fillText('国立印刷局製造', W * 0.46, H - 28);
}

function paintBill(c: HTMLCanvasElement, d: BillDesign) {
  const W = BILL_W;
  const H = BILL_H;
  c.width = W;
  c.height = H;
  const g = c.getContext('2d')!;
  if (d.id === 'euro100') {
    paintEuro100(g, W, H);
  } else if (d.id === 'euro20') {
    paintEuro20(g, W, H);
  } else {
    paintYen1000(g, W, H);
  }
}

// ---------------------------------------------------------------------------
// Coin painters
// ---------------------------------------------------------------------------
type CoinKind = 'copper' | 'silver';

function paintCoinFace(c: HTMLCanvasElement, kind: CoinKind) {
  const S = 256;
  c.width = S;
  c.height = S;
  const g = c.getContext('2d')!;
  const cx = S / 2;
  const cy = S / 2;
  const base = kind === 'copper' ? ['#f6bea2', '#e5997b', '#c9785a'] : ['#ffffff', '#e8e9f0', '#c2c5d3'];
  const gr = g.createRadialGradient(cx - 30, cy - 30, 10, cx, cy, 140);
  gr.addColorStop(0, base[0]);
  gr.addColorStop(0.55, base[1]);
  gr.addColorStop(1, base[2]);
  g.fillStyle = gr;
  g.fillRect(0, 0, S, S);

  g.strokeStyle = INK;
  g.lineWidth = 7;
  g.beginPath();
  g.arc(cx, cy, 122, 0, Math.PI * 2);
  g.stroke();
  g.lineWidth = 2;
  g.beginPath();
  g.arc(cx, cy, 102, 0, Math.PI * 2);
  g.stroke();

  // beads
  g.fillStyle = INK;
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2;
    g.beginPath();
    g.arc(cx + Math.cos(a) * 112, cy + Math.sin(a) * 112, 2.2, 0, Math.PI * 2);
    g.fill();
  }

  // ring text
  const txt = kind === 'copper' ? 'ESTADOS UNIDOS MEXICANOS · ' : 'DIMA FINANCE · CRÉDITO · ';
  g.font = '600 15px Georgia, serif';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  const chars = txt.split('');
  for (let i = 0; i < chars.length; i++) {
    const a = (i / chars.length) * Math.PI * 2 - Math.PI / 2;
    g.save();
    g.translate(cx + Math.cos(a) * 88, cy + Math.sin(a) * 88);
    g.rotate(a + Math.PI / 2);
    g.fillText(chars[i], 0, 0);
    g.restore();
  }

  // Emblem
  if (kind === 'copper') {
    // stylised eagle-ish emblem made of engraved strokes
    g.save();
    g.beginPath();
    g.arc(cx, cy, 66, 0, Math.PI * 2);
    g.clip();
    hatch(g, cx - 70, cy - 70, 140, 140, 5, 0.3, `${INK_SOFT}0.18)`);
    g.restore();
    g.strokeStyle = INK;
    g.lineWidth = 2.4;
    // wings
    for (let side = -1; side <= 1; side += 2) {
      for (let k = 0; k < 5; k++) {
        g.beginPath();
        g.moveTo(cx + side * 8, cy - 4 + k * 5);
        g.quadraticCurveTo(cx + side * (34 + k * 4), cy - 40 + k * 8, cx + side * (52 - k * 3), cy - 18 + k * 12);
        g.stroke();
      }
    }
    // body
    g.beginPath();
    g.ellipse(cx, cy + 6, 10, 26, 0, 0, Math.PI * 2);
    g.fillStyle = base[1];
    g.fill();
    g.stroke();
    g.beginPath();
    g.arc(cx, cy - 26, 8, 0, Math.PI * 2);
    g.fill();
    g.stroke();
    // laurel
    g.lineWidth = 1.6;
    for (let i = 0; i < 9; i++) {
      const a = Math.PI * 0.15 + (i / 9) * Math.PI * 0.7;
      const x = cx + Math.cos(a) * 52;
      const y = cy + Math.sin(a) * 52;
      g.beginPath();
      g.ellipse(x, y, 7, 3, a + Math.PI / 2, 0, Math.PI * 2);
      g.stroke();
    }
  } else {
    rosette(g, cx, cy, 58, 10, 7, 0.6, 1.3);
    g.fillStyle = INK;
    g.font = '700 46px Georgia, serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText('$10', cx, cy + 2);
  }
}

function paintCoinEdge(c: HTMLCanvasElement, kind: CoinKind) {
  c.width = 256;
  c.height = 32;
  const g = c.getContext('2d')!;
  g.fillStyle = kind === 'copper' ? '#d9896a' : '#d6d8e2';
  g.fillRect(0, 0, 256, 32);
  g.strokeStyle = INK;
  g.lineWidth = 2;
  for (let x = 0; x < 256; x += 8) {
    g.beginPath();
    g.moveTo(x, 0);
    g.lineTo(x, 32);
    g.stroke();
  }
  g.lineWidth = 4;
  g.strokeRect(0, 0, 256, 32);
}

// ---------------------------------------------------------------------------
// Simulation types
// ---------------------------------------------------------------------------
interface Item {
  seed: number;
  // flow
  t: number;
  speed: number;
  lat: number;
  depth: number;
  size: number;
  // rotation
  rx: number;
  ry: number;
  rz: number;
  wx: number;
  wy: number;
  wz: number;
  extra: number;
  spin: number;
  // interaction offset & velocity (deflection on hover)
  ox: number;
  oy: number;
  oz: number;
  vx: number;
  vy: number;
  vz: number;
  // bend (bills)
  bendAmp: number;
  curl: number;
}

interface Pool {
  mesh: THREE.InstancedMesh;
  kind: 'bill' | 'coin';
  items: Item[];
  bend?: THREE.InstancedBufferAttribute;
}

interface MoneyFlow3DProps {
  className?: string;
  /** Kepadatan arus (1 = default). */
  density?: number;
  /** Pause render saat window.scrollY melewati (innerHeight * nilai ini). */
  pauseAfterViewport?: number;
}

export default function MoneyFlow3D({ className = '', density = 1, pauseAfterViewport = 0.9 }: MoneyFlow3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSmall = window.innerWidth < 768;
    const rnd = mulberry32(20261015);

    // ---------------- Renderer / scene ----------------
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      return; // WebGL tidak tersedia -> diam saja
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSmall ? 1.5 : 1.75));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const canvas = renderer.domElement;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.appendChild(canvas);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xffffff, 27, 54);

    const CAM_Z = 30;
    const FOV = 35;
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 200);
    camera.position.set(0, 0, CAM_Z);

    scene.add(new THREE.HemisphereLight(0xffffff, 0xe8e5f5, 1.6));
    const sun = new THREE.DirectionalLight(0xffffff, 1.4);
    sun.position.set(-6, 10, 14);
    scene.add(sun);
    const rim = new THREE.DirectionalLight(0xffffff, 0.75);
    rim.position.set(8, -6, 10);
    scene.add(rim);
    const backLight = new THREE.DirectionalLight(0xffffff, 1.15);
    backLight.position.set(0, 0, -20);
    scene.add(backLight);

    // ---------------- Textures ----------------
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const makeTex = (c: HTMLCanvasElement) => {
      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = Math.min(8, maxAniso);
      tex.generateMipmaps = true;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      return tex;
    };

    const billCanvases = BILL_DESIGNS.map((d) => {
      const c = document.createElement('canvas');
      paintBill(c, d);
      return c;
    });
    const billTextures = billCanvases.map(makeTex);

    const coinKinds: CoinKind[] = ['copper', 'silver'];
    const coinFaceCanvases = coinKinds.map((k) => {
      const c = document.createElement('canvas');
      paintCoinFace(c, k);
      return c;
    });
    const coinEdgeCanvases = coinKinds.map((k) => {
      const c = document.createElement('canvas');
      paintCoinEdge(c, k);
      return c;
    });
    const coinFaceTex = coinFaceCanvases.map(makeTex);
    const coinEdgeTex = coinEdgeCanvases.map((c) => {
      const t = makeTex(c);
      t.wrapS = THREE.RepeatWrapping;
      t.repeat.set(5, 1);
      return t;
    });

    let disposed = false;

    // Preload & refresh Yen image as soon as photographic banknote loads
    preloadYenImage(() => {
      if (disposed) return;
      const yenIdx = BILL_DESIGNS.findIndex((d) => d.id === 'yen1000');
      if (yenIdx >= 0 && billCanvases[yenIdx] && billTextures[yenIdx]) {
        paintBill(billCanvases[yenIdx], BILL_DESIGNS[yenIdx]);
        billTextures[yenIdx].needsUpdate = true;
      }
    });

    // Repaint once web fonts (Playfair / Inter Tight) are ready
    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        if (disposed) return;
        billCanvases.forEach((c, i) => {
          paintBill(c, BILL_DESIGNS[i]);
          billTextures[i].needsUpdate = true;
        });
      });
    }

    // ---------------- Materials ----------------
    const timeUniform = { value: 0 };

    const makeBillMaterial = (map: THREE.Texture) => {
      const mat = new THREE.MeshLambertMaterial({ map, side: THREE.DoubleSide });
      mat.onBeforeCompile = (shader) => {
        shader.uniforms.uTime = timeUniform;
        shader.vertexShader = shader.vertexShader
          .replace(
            '#include <common>',
            `#include <common>
            uniform float uTime;
            attribute vec3 aBend; // x: phase, y: wave amplitude, z: curl
            float bendZ(vec2 p) {
              return sin(p.x * 2.1 + uTime * 2.6 + aBend.x) * aBend.y
                   + sin(p.y * 2.8 + uTime * 1.9 + aBend.x * 1.7) * aBend.y * 0.35
                   + p.x * p.x * aBend.z;
            }`
          )
          .replace(
            '#include <beginnormal_vertex>',
            `float bE = 0.01;
            float dzdx = (bendZ(position.xy + vec2(bE, 0.0)) - bendZ(position.xy - vec2(bE, 0.0))) / (2.0 * bE);
            float dzdy = (bendZ(position.xy + vec2(0.0, bE)) - bendZ(position.xy - vec2(0.0, bE))) / (2.0 * bE);
            vec3 objectNormal = normalize(vec3(-dzdx, -dzdy, 1.0));
            #ifdef USE_TANGENT
              vec3 objectTangent = vec3( tangent.xyz );
            #endif`
          )
          .replace('#include <begin_vertex>', 'vec3 transformed = vec3(position.xy, bendZ(position.xy));');
      };
      mat.customProgramCacheKey = () => 'dima-bill-bend';
      return mat;
    };

    const billMaterials = billTextures.map(makeBillMaterial);
    const coinFaceMats = coinFaceTex.map(
      (map) => new THREE.MeshPhongMaterial({ map, shininess: 70, specular: new THREE.Color(0x777777) })
    );
    const coinEdgeMats = coinEdgeTex.map(
      (map) => new THREE.MeshPhongMaterial({ map, shininess: 50, specular: new THREE.Color(0x555555) })
    );

    // ---------------- Geometry ----------------
    const BILL_GW = 2.85;
    const BILL_GH = 1.30;
    const billBaseGeo = new THREE.PlaneGeometry(BILL_GW, BILL_GH, 28, 8);
    const coinGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.08, 44, 1);
    coinGeo.rotateX(Math.PI / 2);

    // ---------------- Pools ----------------
    const d = clamp(density, 0.2, 3) * (isSmall ? 0.6 : 1);
    const billFlowPer = Math.round(7 * d);
    const coinFlowPer = Math.round(12 * d);

    const geometries: THREE.BufferGeometry[] = [coinGeo];
    const pools: Pool[] = [];

    const newItem = (kind: 'bill' | 'coin'): Item => {
      const latRaw = (rnd() + rnd() + rnd() - 1.5) / 1.5;
      return {
        seed: rnd(),
        t: lerp(-0.08, 1.08, rnd()),
        speed: lerp(0.055, 0.085, rnd()),
        lat: latRaw,
        depth: lerp(-2.6, 2.6, rnd()),
        size: kind === 'bill' ? lerp(1.2, 1.9, rnd()) : lerp(0.85, 1.45, rnd()),
        rx: (rnd() - 0.5) * (kind === 'bill' ? 1.4 : Math.PI * 2),
        ry: (rnd() - 0.5) * (kind === 'bill' ? 1.2 : Math.PI * 2),
        rz: rnd() * Math.PI * 2,
        wx: kind === 'bill' ? lerp(0.25, 0.7, rnd()) : lerp(0.6, 2.2, rnd()) * (rnd() < 0.5 ? -1 : 1),
        wy: kind === 'bill' ? lerp(0.2, 0.6, rnd()) : lerp(0.4, 1.6, rnd()) * (rnd() < 0.5 ? -1 : 1),
        wz: (rnd() - 0.5) * (kind === 'bill' ? 0.35 : 1.2),
        extra: 0,
        spin: 0,
        ox: 0,
        oy: 0,
        oz: 0,
        vx: 0,
        vy: 0,
        vz: 0,
        bendAmp: kind === 'bill' ? lerp(0.06, 0.15, rnd()) : 0,
        curl: kind === 'bill' ? lerp(-0.055, 0.055, rnd()) : 0,
      };
    };

    BILL_DESIGNS.forEach((_, i) => {
      const count = billFlowPer;
      const geo = billBaseGeo.clone();
      const bendArr = new Float32Array(count * 3);
      const bend = new THREE.InstancedBufferAttribute(bendArr, 3);
      bend.setUsage(THREE.DynamicDrawUsage);
      geo.setAttribute('aBend', bend);
      geometries.push(geo);
      const mesh = new THREE.InstancedMesh(geo, billMaterials[i], count);
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      mesh.frustumCulled = false;
      scene.add(mesh);
      const items: Item[] = [];
      for (let k = 0; k < count; k++) {
        const it = newItem('bill');
        items.push(it);
        bendArr[k * 3] = it.seed * Math.PI * 2;
        bendArr[k * 3 + 1] = it.bendAmp;
        bendArr[k * 3 + 2] = it.curl;
      }
      pools.push({ mesh, kind: 'bill', items, bend });
    });

    coinKinds.forEach((_, i) => {
      const count = coinFlowPer;
      const mesh = new THREE.InstancedMesh(coinGeo, [coinEdgeMats[i], coinFaceMats[i], coinFaceMats[i]], count);
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      mesh.frustumCulled = false;
      scene.add(mesh);
      const items: Item[] = [];
      for (let k = 0; k < count; k++) items.push(newItem('coin'));
      pools.push({ mesh, kind: 'coin', items });
    });

    // ---------------- Layout / path ----------------
    let vw = 1;
    let vh = 1;
    let hw = 10; // half width (world) at z=0
    let hh = 6; // half height (world) at z=0
    let sizeFactor = 1;
    const P0 = new THREE.Vector2();
    const C = new THREE.Vector2();
    const P2 = new THREE.Vector2();
    const flowDir = new THREE.Vector2();

    const layout = () => {
      const rect = container.getBoundingClientRect();
      vw = Math.max(1, rect.width);
      vh = Math.max(1, rect.height);
      renderer.setSize(vw, vh, false);
      camera.aspect = vw / vh;
      camera.updateProjectionMatrix();
      hh = CAM_Z * Math.tan(THREE.MathUtils.degToRad(FOV / 2));
      hw = hh * camera.aspect;
      sizeFactor = clamp(hw / 14, 0.62, 1.22);
      if (camera.aspect >= 1) {
        // Diagonal kiri-atas -> kanan-bawah, sedikit melengkung (seperti referensi)
        P0.set(-hw * 1.25, hh * 1.2);
        C.set(-hw * 0.12, -hh * 0.02);
        P2.set(hw * 1.3, -hh * 1.25);
      } else {
        // Portrait: lebih curam
        P0.set(-hw * 1.4, hh * 1.05);
        C.set(-hw * 0.1, hh * 0.05);
        P2.set(hw * 1.45, -hh * 1.1);
      }
      flowDir.copy(P2).sub(P0).normalize();
    };
    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(container);

    // ---------------- Pointer ----------------
    const mouseNdc = new THREE.Vector2(9, 9);
    let pointerActive = false;
    const mouseWorld = new THREE.Vector2(); // at z=0
    const prevMouseWorld = new THREE.Vector2();
    const mouseVel = new THREE.Vector2(); // smoothed world units/s

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      pointerActive = inside;
      if (!inside) return;
      mouseNdc.set((x / rect.width) * 2 - 1, -(y / rect.height) * 2 + 1);
    };
    const onPointerLeave = () => {
      pointerActive = false;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('blur', onPointerLeave);

    const ray = new THREE.Vector3();
    const updateRay = () => {
      ray.set(mouseNdc.x, mouseNdc.y, 0.5).unproject(camera).sub(camera.position).normalize();
    };
    const mouseAtZ = (z: number, out: THREE.Vector2) => {
      const k = (z - CAM_Z) / ray.z;
      out.set(ray.x * k, ray.y * k);
      return out;
    };

    // ---------------- Simulation ----------------
    const dummy = new THREE.Object3D();
    const mTmp = new THREE.Vector2();
    const PUSH = 38;
    const DRAG = 2.6;
    const POP = 2.6;
    const SPRING = 2.0;
    const DAMP = 2.2;
    const RADIUS = 4.2;
    const flowSpeedMul = reduceMotion ? 0.35 : 1;

    const bezier = (t: number, out: THREE.Vector2) => {
      const u = 1 - t;
      out.set(u * u * P0.x + 2 * u * t * C.x + t * t * P2.x, u * u * P0.y + 2 * u * t * C.y + t * t * P2.y);
      return out;
    };
    const tangent = (t: number, out: THREE.Vector2) => {
      out.set(2 * (1 - t) * (C.x - P0.x) + 2 * t * (P2.x - C.x), 2 * (1 - t) * (C.y - P0.y) + 2 * t * (P2.y - C.y));
      return out.normalize();
    };
    const bp = new THREE.Vector2();
    const tg = new THREE.Vector2();

    let time = 0;
    let last = performance.now();
    let raf = 0;
    let firstFrame = true;

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.033, Math.max(0.001, (now - last) / 1000));
      last = now;

      // Pause saat hero sudah tidak terlihat (hemat GPU)
      if (window.scrollY > window.innerHeight * pauseAfterViewport) return;

      time += dt;
      timeUniform.value = time;

      // Mouse world + velocity
      updateRay();
      mouseAtZ(0, mouseWorld);
      if (pointerActive) {
        const rawVx = (mouseWorld.x - prevMouseWorld.x) / dt;
        const rawVy = (mouseWorld.y - prevMouseWorld.y) / dt;
        const a = 1 - Math.exp(-dt * 18);
        mouseVel.x = lerp(mouseVel.x, clamp(rawVx, -90, 90), a);
        mouseVel.y = lerp(mouseVel.y, clamp(rawVy, -90, 90), a);
      } else {
        mouseVel.multiplyScalar(Math.exp(-dt * 6));
      }
      prevMouseWorld.copy(mouseWorld);
      const mouseSpeed = mouseVel.length();

      const damp = Math.exp(-DAMP * dt);

      for (const pool of pools) {
        const { mesh, items, kind } = pool;
        const bendArr = pool.bend ? (pool.bend.array as Float32Array) : null;

        for (let i = 0; i < items.length; i++) {
          const it = items[i];

          // ---------- Flow motion along Bezier arc ----------
          it.t += it.speed * dt * flowSpeedMul;
          if (it.t > 1.1) {
            it.t -= 1.2;
            it.lat = (rnd() + rnd() + rnd() - 1.5) / 1.5;
            it.depth = lerp(-2.6, 2.6, rnd());
            it.ox = it.oy = it.oz = 0;
            it.vx = it.vy = it.vz = 0;
          }
          const t = it.t;
          bezier(t, bp);
          tangent(t, tg);
          const spread = hh * (0.17 + 0.36 * clamp(t, 0, 1));
          const baseX = bp.x - tg.y * it.lat * spread + Math.sin(time * 0.55 + it.seed * 12) * 0.28;
          const baseY = bp.y + tg.x * it.lat * spread + Math.cos(time * 0.47 + it.seed * 9) * 0.28;
          const baseZ = lerp(-7.5, 3.2, clamp(t, -0.1, 1.1)) + it.depth;

          // Cursor interaction: Mendorong uang menjauh & terseret kursor secara responsif (terasa hidup tapi tidak bombastis)
          if (pointerActive) {
            mouseAtZ(baseZ + it.oz, mTmp);
            const dx = baseX + it.ox - mTmp.x;
            const dy = baseY + it.oy - mTmp.y;
            const R = RADIUS * sizeFactor * ((CAM_Z - baseZ) / CAM_Z);
            const d2 = dx * dx + dy * dy;
            if (d2 < R * R) {
              const dist = Math.sqrt(d2) + 1e-4;
              let f = 1 - dist / R;
              f *= f;
              const depthScale = (CAM_Z - baseZ) / CAM_Z;
              it.vx += ((dx / dist) * PUSH * f + mouseVel.x * DRAG * f * depthScale) * dt;
              it.vy += ((dy / dist) * PUSH * f + mouseVel.y * DRAG * f * depthScale) * dt;
              it.vz += POP * f * dt;
              it.spin = Math.min(it.spin + (f * 3.2 + f * mouseSpeed * 0.12) * dt * 2.8, 3.2);
            }
          }

          // Spring back to stream (elastis kembali ke posisi arus asli secara anggun)
          it.vx += -it.ox * SPRING * dt;
          it.vy += -it.oy * SPRING * dt;
          it.vz += -it.oz * SPRING * 1.4 * dt;
          it.vx *= damp;
          it.vy *= damp;
          it.vz *= damp;
          it.ox += it.vx * dt;
          it.oy += it.vy * dt;
          it.oz += it.vz * dt;

          const x = baseX + it.ox;
          const y = baseY + it.oy;
          const z = baseZ + it.oz;
          const scale = it.size * sizeFactor;

          // ---------- Rotation ----------
          it.spin *= Math.exp(-1.8 * dt);
          it.extra += it.spin * dt * 0.65;
          let rx: number;
          let ry: number;
          let rz: number;
          if (kind === 'bill') {
            rx = it.rx + Math.sin(time * it.wx + it.seed * 20) * 0.55 + it.extra * 0.6;
            ry = it.ry + Math.sin(time * it.wy + it.seed * 31) * 0.5 + it.extra * 0.45;
            rz = it.rz + time * it.wz;
            if (bendArr) {
              bendArr[i * 3 + 1] = it.bendAmp * (1 + Math.min(it.spin, 3.2) * 0.22);
            }
          } else {
            rx = it.rx + time * it.wx + it.extra * 0.5;
            ry = it.ry + time * it.wy + it.extra * 0.4;
            rz = it.rz + time * it.wz;
          }

          dummy.position.set(x, y, z);
          dummy.rotation.set(rx, ry, rz);
          dummy.scale.setScalar(Math.max(0.0001, scale));
          dummy.updateMatrix();
          mesh.setMatrixAt(i, dummy.matrix);
        }
        mesh.instanceMatrix.needsUpdate = true;
        if (pool.bend) pool.bend.needsUpdate = true;
      }

      renderer.render(scene, camera);
      if (firstFrame) {
        firstFrame = false;
        container.style.opacity = '1';
      }
    };
    raf = requestAnimationFrame(tick);

    // ---------------- Cleanup ----------------
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerMove);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('blur', onPointerLeave);
      pools.forEach((p) => {
        scene.remove(p.mesh);
        p.mesh.dispose();
      });
      geometries.forEach((g) => g.dispose());
      billBaseGeo.dispose();
      [...billMaterials, ...coinFaceMats, ...coinEdgeMats].forEach((m) => m.dispose());
      [...billTextures, ...coinFaceTex, ...coinEdgeTex].forEach((t) => t.dispose());
      renderer.dispose();
      if (canvas.parentElement === container) container.removeChild(canvas);
    };
  }, [density, pauseAfterViewport]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none ${className}`}
      style={{ opacity: 0, transition: 'opacity 1.2s ease-out' }}
    />
  );
}
