import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

interface Product {
  number: string; label: string; tagline: string; heading: string;
  description: string[]; features: string[]; image: string; ctaLink: string;
}
interface Props { products: Product[] }

function IllusSimple({ canvas }: { canvas: HTMLCanvasElement }) {
  let raf = 0, t = 0
  const BARS = 12
  function draw() {
    const ctx = canvas.getContext('2d')!
    const W = canvas.width, H = canvas.height
    ctx.clearRect(0, 0, W, H)
    t += 0.012
    const padL = W * 0.1, padR = W * 0.08
    const padT = H * 0.12, padB = H * 0.18
    const chartW = W - padL - padR
    const chartH = H - padT - padB
    const barW   = chartW / BARS * 0.6
    const gap    = chartW / BARS
    ctx.strokeStyle = 'rgba(244,244,245,0.12)'
    ctx.lineWidth = 0.8
    ctx.beginPath()
    ctx.moveTo(padL, padT); ctx.lineTo(padL, padT + chartH)
    ctx.lineTo(padL + chartW, padT + chartH)
    ctx.stroke()
    for (let i = 1; i <= 4; i++) {
      const y = padT + chartH - (chartH / 4) * i
      ctx.beginPath()
      ctx.strokeStyle = 'rgba(244,244,245,0.05)'
      ctx.setLineDash([3, 6])
      ctx.moveTo(padL, y); ctx.lineTo(padL + chartW, y)
      ctx.stroke()
      ctx.setLineDash([])
    }
    for (let i = 0; i < BARS; i++) {
      const ratio     = i / (BARS - 1)
      const animate   = (Math.sin(t - i * 0.3) * 0.04)
      const totalH    = chartH * (1 - ratio * 0.85 + animate)
      const interestH = chartH * (1 - ratio) * 0.35
      const capitalH  = totalH - interestH
      const x = padL + gap * i + (gap - barW) / 2
      const y = padT + chartH
      const alpha = 0.6 + (1 - ratio) * 0.4
      ctx.fillStyle = `rgba(229,153,123,${alpha})`
      ctx.fillRect(x, y - totalH, barW, capitalH)
      ctx.fillStyle = `rgba(244,244,245,${0.08 + (1 - ratio) * 0.12})`
      ctx.fillRect(x, y - totalH, barW, -interestH)
      const progress = ((t * 0.3) % 1) * BARS
      if (Math.abs(i - progress) < 0.8) {
        ctx.strokeStyle = '#E5997B'
        ctx.lineWidth = 1.5
        ctx.strokeRect(x - 1, y - totalH - 1, barW + 2, totalH + 2)
      }
    }
    ctx.beginPath()
    ctx.strokeStyle = 'rgba(229,153,123,0.85)'
    ctx.lineWidth = 2
    for (let x = 0; x <= chartW; x += 2) {
      const r = x / chartW
      const y = padT + chartH - chartH * (1 - r * 0.85) + Math.sin(t + r * 8) * 2
      x === 0 ? ctx.moveTo(padL + x, y) : ctx.lineTo(padL + x, y)
    }
    ctx.stroke()
    ctx.fillStyle = 'rgba(244,244,245,0.25)'
    ctx.font = `${W * 0.028}px monospace`
    ctx.textAlign = 'left'
    ctx.fillText('Capital', padL, padT - 8)
    ctx.fillStyle = 'rgba(229,153,123,0.5)'
    ctx.textAlign = 'right'
    ctx.fillText('Amortización', W - padR, padT - 8)
    ctx.fillStyle = 'rgba(244,244,245,0.2)'
    ctx.font = `${W * 0.022}px monospace`
    ctx.textAlign = 'center'
    ;['01','03','06','09','12'].forEach((m, i) => {
      ctx.fillText(m, padL + gap * i * 2.4, padT + chartH + 18)
    })
    raf = requestAnimationFrame(draw)
  }
  draw()
  return () => cancelAnimationFrame(raf)
}

function IllusBridge({ canvas }: { canvas: HTMLCanvasElement }) {
  let raf = 0, t = 0
  function draw() {
    const ctx = canvas.getContext('2d')!
    const W = canvas.width, H = canvas.height
    ctx.clearRect(0, 0, W, H)
    t += 0.008
    const midY = H * 0.55, left = W * 0.12, right = W * 0.88
    const gapL = W * 0.38, gapR = W * 0.62
    ctx.strokeStyle = 'rgba(244,244,245,0.15)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(left, midY); ctx.lineTo(gapL, midY)
    ctx.moveTo(gapR, midY); ctx.lineTo(right, midY)
    ctx.stroke()
    const stackH = H * 0.28
    for (let i = 0; i < 4; i++) {
      const bH = stackH / 4
      const bY = midY - bH * (i + 1)
      const alpha = 0.2 + i * 0.12
      ctx.fillStyle = `rgba(229,153,123,${alpha})`
      ctx.fillRect(left, bY, W * 0.18, bH - 2)
      ctx.strokeStyle = 'rgba(229,153,123,0.3)'
      ctx.lineWidth = 0.5
      ctx.strokeRect(left, bY, W * 0.18, bH - 2)
    }
    ctx.fillStyle = 'rgba(229,153,123,0.6)'
    ctx.font = `bold ${W * 0.026}px monospace`
    ctx.textAlign = 'center'
    ctx.fillText('COSTOS', left + W * 0.09, midY + 20)
    const revH = H * 0.38
    const pulse = Math.sin(t * 2) * 0.03
    ctx.fillStyle = `rgba(244,244,245,${0.06 + pulse})`
    ctx.fillRect(gapR, midY - revH, W * 0.18, revH)
    ctx.strokeStyle = 'rgba(244,244,245,0.2)'
    ctx.lineWidth = 1
    ctx.strokeRect(gapR, midY - revH, W * 0.18, revH)
    for (let i = 1; i < 4; i++) {
      ctx.beginPath()
      ctx.setLineDash([2, 4])
      ctx.strokeStyle = 'rgba(244,244,245,0.1)'
      ctx.moveTo(gapR, midY - (revH / 4) * i)
      ctx.lineTo(gapR + W * 0.18, midY - (revH / 4) * i)
      ctx.stroke()
      ctx.setLineDash([])
    }
    ctx.fillStyle = 'rgba(244,244,245,0.4)'
    ctx.font = `bold ${W * 0.026}px monospace`
    ctx.textAlign = 'center'
    ctx.fillText('INGRESOS', gapR + W * 0.09, midY + 20)
    const progress = (Math.sin(t * 0.5) * 0.5 + 0.5) * 0.9 + 0.1
    const archMidX = (gapL + gapR) / 2
    const archH    = H * 0.22
    ctx.save()
    ctx.beginPath()
    ctx.rect(gapL, 0, (gapR - gapL) * progress, H)
    ctx.clip()
    ctx.beginPath()
    ctx.moveTo(gapL, midY)
    ctx.bezierCurveTo(gapL, midY - archH, gapR, midY - archH, gapR, midY)
    ctx.strokeStyle = '#E5997B'
    ctx.lineWidth = 2.5
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(gapL, midY - archH * 0.45)
    ctx.lineTo(gapR, midY - archH * 0.45)
    ctx.strokeStyle = 'rgba(229,153,123,0.9)'
    ctx.lineWidth = 2
    ctx.stroke()
    for (let i = 0; i <= 5; i++) {
      const x = gapL + (gapR - gapL) * (i / 5)
      const archY = midY - archH * (1 - 4 * Math.pow(i/5 - 0.5, 2))
      ctx.beginPath()
      ctx.moveTo(x, archY)
      ctx.lineTo(x, midY - archH * 0.45)
      ctx.strokeStyle = 'rgba(229,153,123,0.35)'
      ctx.lineWidth = 0.7
      ctx.stroke()
    }
    ctx.restore()
    ctx.fillStyle = 'rgba(229,153,123,0.45)'
    ctx.font = `${W * 0.024}px monospace`
    ctx.textAlign = 'center'
    ctx.fillText('BRECHA DE', archMidX, midY - archH * 0.85)
    ctx.fillText('FINANCIAMIENTO', archMidX, midY - archH * 0.7)
    raf = requestAnimationFrame(draw)
  }
  draw()
  return () => cancelAnimationFrame(raf)
}

function IllusCorriente({ canvas }: { canvas: HTMLCanvasElement }) {
  let raf = 0, t = 0
  function draw() {
    const ctx = canvas.getContext('2d')!
    const W = canvas.width, H = canvas.height
    ctx.clearRect(0, 0, W, H)
    t += 0.015
    const cx = W / 2, cy = H * 0.48
    const tankW = W * 0.28, tankH = H * 0.55
    const tankX = cx - tankW / 2, tankY = cy - tankH / 2
    const level = 0.3 + Math.sin(t * 0.6) * 0.28
    const liqY  = tankY + tankH * (1 - level)
    ctx.strokeStyle = 'rgba(229,153,123,0.85)'
    ctx.lineWidth = 2
    ctx.strokeRect(tankX, tankY, tankW, tankH)
    ctx.save()
    ctx.beginPath()
    ctx.rect(tankX + 1, tankY + 1, tankW - 2, tankH - 2)
    ctx.clip()
    ctx.beginPath()
    const waveAmp = 6
    ctx.moveTo(tankX, liqY + waveAmp)
    for (let x = tankX; x <= tankX + tankW; x += 2) {
      const y = liqY + Math.sin((x - tankX) / tankW * Math.PI * 3 + t * 3) * waveAmp
      ctx.lineTo(x, y)
    }
    ctx.lineTo(tankX + tankW, tankY + tankH)
    ctx.lineTo(tankX, tankY + tankH)
    ctx.closePath()
    const grad = ctx.createLinearGradient(0, liqY, 0, tankY + tankH)
    grad.addColorStop(0, 'rgba(229,153,123,0.85)')
    grad.addColorStop(1, 'rgba(229,153,123,0.4)')
    ctx.fillStyle = grad
    ctx.fill()
    ctx.restore()
    ctx.fillStyle = 'rgba(229,153,123,0.9)'
    ctx.font = `bold ${W * 0.055}px monospace`
    ctx.textAlign = 'center'
    ctx.fillText(Math.round(level * 100) + '%', cx, cy + W * 0.025)
    ctx.fillStyle = 'rgba(244,244,245,0.3)'
    ctx.font = `${W * 0.026}px monospace`
    ctx.fillText('LIQUIDEZ', cx, cy + W * 0.065)
    for (let i = 1; i < 5; i++) {
      const ty = tankY + tankH * (i / 5)
      ctx.beginPath()
      ctx.strokeStyle = 'rgba(244,244,245,0.12)'
      ctx.lineWidth = 0.5
      ctx.moveTo(tankX + tankW, ty); ctx.lineTo(tankX + tankW + 8, ty)
      ctx.stroke()
      ctx.fillStyle = 'rgba(244,244,245,0.18)'
      ctx.font = `${W * 0.022}px monospace`
      ctx.textAlign = 'left'
      ctx.fillText(String((5 - i) * 20) + '%', tankX + tankW + 12, ty + 4)
    }
    const arrowAlpha = level > 0.3 ? 0.8 : 0.2
    ctx.strokeStyle = `rgba(229,153,123,${arrowAlpha})`
    ctx.lineWidth = 1.5
    ctx.setLineDash([4, 4])
    ctx.beginPath()
    ctx.moveTo(tankX - 8, cy)
    ctx.lineTo(tankX - W * 0.18, cy)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.beginPath()
    ctx.moveTo(tankX - W * 0.18, cy - 5)
    ctx.lineTo(tankX - W * 0.18 - 10, cy)
    ctx.lineTo(tankX - W * 0.18, cy + 5)
    ctx.fillStyle = `rgba(229,153,123,${arrowAlpha})`
    ctx.fill()
    ctx.fillStyle = 'rgba(229,153,123,0.5)'
    ctx.font = `${W * 0.024}px monospace`
    ctx.textAlign = 'center'
    ctx.fillText('DISPONES', tankX - W * 0.12, cy - 14)
    const repoAlpha = level < 0.7 ? 0.8 : 0.2
    ctx.strokeStyle = `rgba(244,244,245,${repoAlpha * 0.6})`
    ctx.lineWidth = 1.5
    ctx.setLineDash([4, 4])
    ctx.beginPath()
    ctx.moveTo(tankX + tankW + 8, cy)
    ctx.lineTo(tankX + tankW + W * 0.18, cy)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.beginPath()
    ctx.moveTo(tankX + tankW + 8, cy - 5)
    ctx.lineTo(tankX + tankW + 8 + 10, cy)
    ctx.lineTo(tankX + tankW + 8, cy + 5)
    ctx.fillStyle = `rgba(244,244,245,${repoAlpha * 0.4})`
    ctx.fill()
    ctx.fillStyle = 'rgba(244,244,245,0.3)'
    ctx.font = `${W * 0.024}px monospace`
    ctx.textAlign = 'center'
    ctx.fillText('REPONES', tankX + tankW + W * 0.12, cy - 14)
    ctx.fillStyle = 'rgba(229,153,123,0.4)'
    ctx.font = `${W * 0.026}px monospace`
    ctx.textAlign = 'center'
    ctx.fillText('LÍNEA REVOLVENTE ACTIVA', cx, tankY + tankH + 28)
    raf = requestAnimationFrame(draw)
  }
  draw()
  return () => cancelAnimationFrame(raf)
}

function IllusAgro({ canvas }: { canvas: HTMLCanvasElement }) {
  let raf = 0, t = 0
  function draw() {
    const ctx = canvas.getContext('2d')!
    const W = canvas.width, H = canvas.height
    ctx.clearRect(0, 0, W, H)
    t += 0.01
    const ground = H * 0.70, PLANTS = 5
    ctx.strokeStyle = 'rgba(229,153,123,0.25)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(W * 0.05, ground); ctx.lineTo(W * 0.95, ground)
    ctx.stroke()
    const season = (t * 0.08) % 1
    const sunX = W * 0.1 + W * 0.8 * season, sunY = H * 0.12
    const sunR = W * 0.04, sunAlpha = 0.3 + Math.sin(t * 2) * 0.1
    ctx.beginPath()
    ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(229,153,123,${sunAlpha})`
    ctx.fill()
    ctx.strokeStyle = `rgba(229,153,123,${sunAlpha * 0.5})`
    ctx.lineWidth = 0.8
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2
      ctx.beginPath()
      ctx.moveTo(sunX + Math.cos(a) * sunR * 1.3, sunY + Math.sin(a) * sunR * 1.3)
      ctx.lineTo(sunX + Math.cos(a) * sunR * 1.8, sunY + Math.sin(a) * sunR * 1.8)
      ctx.stroke()
    }
    const seasons = ['SIEMBRA', 'CRECIMIENTO', 'COSECHA', 'REPOSO']
    const sIdx = Math.floor(season * 4)
    ctx.fillStyle = 'rgba(229,153,123,0.6)'
    ctx.font = `bold ${W * 0.028}px monospace`
    ctx.textAlign = 'center'
    ctx.fillText(seasons[sIdx], W / 2, H * 0.06)
    for (let i = 0; i < PLANTS; i++) {
      const px = W * 0.15 + (W * 0.70 / (PLANTS - 1)) * i
      const plantSeason = ((season + (i / PLANTS) * 0.3) % 1)
      const height = Math.min(1, plantSeason * 2.5) * H * 0.30
      if (height < 2) continue
      ctx.strokeStyle = `rgba(229,153,123,0.45)`
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(px, ground)
      ctx.bezierCurveTo(px, ground - height * 0.5, px + Math.sin(t + i) * 8, ground - height, px, ground - height)
      ctx.stroke()
      if (height > H * 0.08) {
        for (let l = 0; l < 2; l++) {
          const leafY = ground - height * (0.4 + l * 0.3)
          const leafDir = l % 2 === 0 ? 1 : -1
          ctx.beginPath()
          ctx.ellipse(px + leafDir * W * 0.025, leafY, W * 0.025, H * 0.02, leafDir * 0.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(229,153,123,0.2)`
          ctx.fill()
        }
      }
      if (plantSeason > 0.5 && height > H * 0.15) {
        ctx.beginPath()
        ctx.arc(px, ground - height - 6, 5, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(229,153,123,0.7)'
        ctx.fill()
      }
    }
    const timeY = H * 0.88
    ctx.strokeStyle = 'rgba(244,244,245,0.1)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(W * 0.05, timeY); ctx.lineTo(W * 0.95, timeY)
    ctx.stroke()
    const milestones = [
      { x: 0.1,  label: 'PRÉSTAMO', bronze: true },
      { x: 0.38, label: 'INICIO',   bronze: false },
      { x: 0.65, label: 'COSECHA',  bronze: true },
      { x: 0.9,  label: 'PAGO',     bronze: true },
    ]
    milestones.forEach(m => {
      const mx = W * m.x
      const active = season >= m.x - 0.05 && season <= m.x + 0.2
      ctx.beginPath()
      ctx.arc(mx, timeY, active ? 5 : 3, 0, Math.PI * 2)
      ctx.fillStyle = m.bronze ? `rgba(229,153,123,${active ? 0.9 : 0.4})` : `rgba(244,244,245,${active ? 0.6 : 0.2})`
      ctx.fill()
      ctx.fillStyle = m.bronze ? 'rgba(229,153,123,0.55)' : 'rgba(244,244,245,0.25)'
      ctx.font = `${W * 0.022}px monospace`
      ctx.textAlign = 'center'
      ctx.fillText(m.label, mx, timeY + 16)
    })
    raf = requestAnimationFrame(draw)
  }
  draw()
  return () => cancelAnimationFrame(raf)
}

function IllusFactoring({ canvas }: { canvas: HTMLCanvasElement }) {
  let raf = 0, t = 0
  function draw() {
    const ctx = canvas.getContext('2d')!
    const W = canvas.width, H = canvas.height
    ctx.clearRect(0, 0, W, H)
    t += 0.01
    const cy = H * 0.48, instX = W * 0.5, instW = W * 0.22, instH = H * 0.28
    for (let i = 0; i < 3; i++) {
      const progress = ((t * 0.18 + i / 3) % 1)
      if (progress > 0.5) continue
      const x = W * 0.06 + progress * (instX - instW / 2 - W * 0.06)
      const y = cy - H * 0.12 + i * H * 0.12
      const alpha = Math.sin(progress * Math.PI) * 0.7
      ctx.fillStyle = `rgba(244,244,245,${alpha * 0.08})`
      ctx.strokeStyle = `rgba(244,244,245,${alpha * 0.3})`
      ctx.lineWidth = 0.8
      ctx.fillRect(x, y, W * 0.1, H * 0.09)
      ctx.strokeRect(x, y, W * 0.1, H * 0.09)
      for (let l = 0; l < 3; l++) {
        ctx.fillStyle = `rgba(244,244,245,${alpha * 0.2})`
        ctx.fillRect(x + 4, y + 8 + l * 9, W * 0.06, 2)
      }
      ctx.fillStyle = `rgba(244,244,245,${alpha * 0.5})`
      ctx.font = `${W * 0.022}px monospace`
      ctx.textAlign = 'left'
      ctx.fillText('$', x + W * 0.065, y + H * 0.055)
    }
    ctx.strokeStyle = 'rgba(229,153,123,0.95)'
    ctx.lineWidth = 2
    ctx.strokeRect(instX - instW / 2, cy - instH / 2, instW, instH)
    ctx.fillStyle = 'rgba(229,153,123,0.12)'
    ctx.fillRect(instX - instW / 2, cy - instH / 2, instW, instH)
    ctx.fillStyle = 'rgba(229,153,123,0.8)'
    ctx.font = `bold ${W * 0.026}px monospace`
    ctx.textAlign = 'center'
    ctx.fillText('DIMA', instX, cy - 4)
    ctx.fillStyle = 'rgba(229,153,123,0.45)'
    ctx.font = `${W * 0.022}px monospace`
    ctx.fillText('FINANCE', instX, cy + 12)
    const ring = (t * 0.8) % 1
    ctx.beginPath()
    ctx.arc(instX, cy, (instW / 2) * (1 + ring * 0.8), 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(229,153,123,${(1 - ring) * 0.2})`
    ctx.lineWidth = 1
    ctx.stroke()
    for (let i = 0; i < 3; i++) {
      const progress = ((t * 0.18 + i / 3) % 1)
      if (progress < 0.5) continue
      const p2 = (progress - 0.5) * 2
      const x = instX + instW / 2 + p2 * (W * 0.88 - instX - instW / 2)
      const y = cy - H * 0.08 + i * H * 0.08
      const alpha = Math.sin(p2 * Math.PI) * 0.8
      ctx.beginPath()
      ctx.arc(x, y, 10, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(229,153,123,${alpha * 0.7})`
      ctx.fill()
      ctx.fillStyle = `rgba(3,0,53,${alpha * 0.9})`
      ctx.font = `bold ${W * 0.028}px monospace`
      ctx.textAlign = 'center'
      ctx.fillText('$', x, y + 4)
    }
    ctx.fillStyle = 'rgba(229,153,123,0.45)'
    ctx.font = `${W * 0.024}px monospace`
    ctx.textAlign = 'center'
    ctx.fillText(`ANTICIPO EN < 48 HRS`, W / 2, H * 0.88)
    ctx.fillStyle = 'rgba(244,244,245,0.25)'
    ctx.font = `${W * 0.024}px monospace`
    ctx.textAlign = 'center'
    ctx.fillText('TUS FACTURAS', W * 0.18, cy + H * 0.22)
    ctx.fillText('TU EMPRESA', W * 0.82, cy + H * 0.22)
    raf = requestAnimationFrame(draw)
  }
  draw()
  return () => cancelAnimationFrame(raf)
}

function IllusLeasing({ canvas }: { canvas: HTMLCanvasElement }) {
  let raf = 0, t = 0
  function draw() {
    const ctx = canvas.getContext('2d')!
    const W = canvas.width, H = canvas.height
    ctx.clearRect(0, 0, W, H)
    t += 0.008
    const cx = W / 2, barY = H * 0.52, barW = W * 0.78
    const barH = H * 0.06, barX = cx - barW / 2
    const ownership = (Math.sin(t * 0.35) * 0.5 + 0.5)
    const pct = Math.round(ownership * 100)
    const assetX = barX - W * 0.08, assetY = barY - H * 0.22
    const assetW = W * 0.14, assetH = H * 0.18
    ctx.strokeStyle = `rgba(229,153,123,${0.3 + ownership * 0.4})`
    ctx.lineWidth = 1.2
    ctx.fillStyle = `rgba(229,153,123,${0.03 + ownership * 0.08})`
    ctx.fillRect(assetX, assetY, assetW, assetH)
    ctx.strokeRect(assetX, assetY, assetW, assetH)
    ctx.fillStyle = `rgba(229,153,123,${0.2 + ownership * 0.4})`
    ctx.fillRect(assetX + 8, assetY + 8, assetW * 0.3, assetH * 0.3)
    ctx.fillRect(assetX + assetW * 0.55, assetY + 8, assetW * 0.3, assetH * 0.3)
    ;[0.2, 0.8].forEach(r => {
      ctx.beginPath()
      ctx.arc(assetX + assetW * r, assetY + assetH + 5, 7, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(229,153,123,${0.4 + ownership * 0.3})`
      ctx.stroke()
    })
    ctx.fillStyle = `rgba(229,153,123,${0.5 + ownership * 0.4})`
    ctx.font = `bold ${W * 0.028}px monospace`
    ctx.textAlign = 'center'
    ctx.fillText(`${pct}%`, assetX + assetW / 2, assetY - 10)
    ctx.fillStyle = 'rgba(244,244,245,0.25)'
    ctx.font = `${W * 0.022}px monospace`
    ctx.fillText('TUYO', assetX + assetW / 2, assetY - 26)
    ctx.fillStyle = 'rgba(244,244,245,0.06)'
    ctx.fillRect(barX, barY, barW, barH)
    ctx.strokeStyle = 'rgba(244,244,245,0.1)'
    ctx.lineWidth = 0.8
    ctx.strokeRect(barX, barY, barW, barH)
    const grad = ctx.createLinearGradient(barX, 0, barX + barW, 0)
    grad.addColorStop(0, 'rgba(229,153,123,0.95)')
    grad.addColorStop(1, 'rgba(229,153,123,0.6)')
    ctx.fillStyle = grad
    ctx.fillRect(barX, barY, barW * ownership, barH)
    const PERIODS = 6
    for (let i = 1; i <= PERIODS; i++) {
      const tx = barX + barW * (i / PERIODS)
      const paid = (i / PERIODS) <= ownership
      ctx.beginPath()
      ctx.moveTo(tx, barY - 4); ctx.lineTo(tx, barY + barH + 4)
      ctx.strokeStyle = paid ? 'rgba(229,153,123,0.6)' : 'rgba(244,244,245,0.12)'
      ctx.lineWidth = paid ? 1.2 : 0.5
      ctx.stroke()
      ctx.fillStyle = paid ? 'rgba(229,153,123,0.55)' : 'rgba(244,244,245,0.18)'
      ctx.font = `${W * 0.022}px monospace`
      ctx.textAlign = 'center'
      ctx.fillText(`P${i}`, tx, barY + barH + 18)
    }
    const resX = barX + barW * 0.92
    ctx.beginPath()
    ctx.moveTo(resX, barY - 12); ctx.lineTo(resX, barY)
    ctx.strokeStyle = 'rgba(229,153,123,0.5)'
    ctx.lineWidth = 1
    ctx.stroke()
    ctx.fillStyle = 'rgba(229,153,123,0.45)'
    ctx.font = `${W * 0.022}px monospace`
    ctx.textAlign = 'center'
    ctx.fillText('VALOR', resX, barY - 22)
    ctx.fillText('RESIDUAL', resX, barY - 10)
    ctx.fillStyle = 'rgba(244,244,245,0.25)'
    ctx.font = `${W * 0.024}px monospace`
    ctx.textAlign = 'left'
    ctx.fillText('INICIO', barX, barY + barH + 34)
    ctx.textAlign = 'right'
    ctx.fillStyle = 'rgba(229,153,123,0.5)'
    ctx.fillText('PROPIETARIO', barX + barW, barY + barH + 34)
    ctx.fillStyle = 'rgba(229,153,123,0.35)'
    ctx.font = `${W * 0.024}px monospace`
    ctx.textAlign = 'center'
    ctx.fillText('PAGOS PERIÓDICOS → TRANSFERENCIA DE PROPIEDAD', cx, H * 0.92)
    raf = requestAnimationFrame(draw)
  }
  draw()
  return () => cancelAnimationFrame(raf)
}

const ILLUSTRATORS = [
  IllusSimple, IllusBridge, IllusCorriente,
  IllusAgro,   IllusFactoring, IllusLeasing,
]

function ProductIllustration({ active }: { active: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const fn = ILLUSTRATORS[active] ?? ILLUSTRATORS[0]
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    const cleanup = fn({ canvas })
    return () => { cleanup?.(); ro.disconnect() }
  }, [active])
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none"/>
}

export default function ProductosShowcase({ products }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [prev,   setPrev]   = useState(0)
  const dir = active >= prev ? 1 : -1

  const scrollToProduct = (index: number) => {
    const st = ScrollTrigger.getById('productScroll')
    if (!st) return
    const target = st.start + (index / Math.max(products.length - 1, 1)) * (st.end - st.start)
    window.scrollTo({ top: target, behavior: 'smooth' })
  }

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        id: 'productScroll',
        trigger: sectionRef.current,
        start: 'top top',
        end: `+=${products.length * 150}%`,
        pin: true, scrub: 1,
        onUpdate: (self) => {
          const idx = Math.min(Math.floor(self.progress * products.length), products.length - 1)
          setActive(cur => { if (cur !== idx) setPrev(cur); return idx })
        },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [products.length])

  const p = products[active]
  const wordCount = p.heading.split(' ').length
  const headingSize = wordCount > 5
    ? 'clamp(2.4rem, 4vw, 4.5rem)'
    : wordCount > 3
      ? 'clamp(2.8rem, 5vw, 5.5rem)'
      : 'clamp(3.2rem, 6vw, 6.5rem)'

  return (
    <div ref={sectionRef} className="relative h-screen overflow-hidden bg-[#030035]">

      {/* Illustration canvas */}
      <div className="absolute right-0 top-0 w-[48%] h-full">
        <AnimatePresence mode="wait">
          <motion.div key={`illus-${active}`} className="absolute inset-0"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}>
            <ProductIllustration active={active} />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(90deg, #030035 0%, rgba(3,0,53,0.2) 25%, transparent 55%)',
        }}/>
      </div>

      {/* Photo bg */}
      <AnimatePresence>
        <motion.div key={`bg-${active}`} className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 1.8 }}>
          <img src={p.image} className="w-full h-full object-cover" style={{ opacity: 0.22 }} alt=""/>
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(90deg, rgba(3,0,53,0.88) 35%, rgba(3,0,53,0.35) 100%)',
          }}/>
        </motion.div>
      </AnimatePresence>

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-30 border-b border-[#F4F4F5]/[0.05] py-3 px-8 md:px-14 flex items-center justify-between">
        <span className="font-mono text-[7px] tracking-[0.5em] uppercase text-[#F4F4F5]/15">
          DIMA Finance — Portafolio Crediticio
        </span>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-[#E5997B] rounded-full animate-pulse"/>
          <span className="font-mono text-[7px] tracking-[0.4em] uppercase text-[#F4F4F5]/15">
            {String(active + 1).padStart(2,'0')} / {String(products.length).padStart(2,'00')}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex pt-12 pb-20">
        <div className="flex flex-col justify-center px-8 md:px-24 lg:px-32 w-full lg:w-[50%] overflow-hidden">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div key={`content-${active}`} custom={dir}
              variants={{
                enter: (d) => ({ opacity: 0, y: d * 28, filter: 'blur(5px)' }),
                center:     ({ opacity: 1, y: 0,      filter: 'blur(0px)' }),
                exit:  (d) => ({ opacity: 0, y: d * -18, filter: 'blur(3px)' }),
              }}
              initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.5, ease: [0.16,1,0.3,1] }}
              className="w-full"
            >
              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-[11px] tracking-[0.5em] uppercase text-[#E5997B]/80">{p.number}</span>
                <div className="w-8 h-px bg-[#E5997B]/40"/>
                <span className="font-mono text-[11px] tracking-[0.4em] uppercase text-[#F4F4F5]/55">{p.tagline}</span>
              </div>

              {/* Heading — adaptive size */}
              <h2 className="font-display font-light text-[#F4F4F5] leading-[1.06] tracking-tight mb-5"
                style={{ fontSize: headingSize }}>
                {p.heading.split(' ').map((word, wi) => (
                  <span key={wi} className="inline-block mr-[0.14em]">
                    {wi === 0 ? <em className="not-italic text-[#E5997B]">{word}</em> : word}
                  </span>
                ))}
              </h2>

              {/* Ornament */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-px bg-[#E5997B]/35"/>
                <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
                  <path d="M3.5 0L7 3.5L3.5 7L0 3.5Z" fill="#E5997B" opacity="0.5"/>
                </svg>
                <div className="flex-1 h-px bg-[#F4F4F5]/[0.12]"/>
              </div>

              {/* Description */}
              <p className="font-body text-[#F4F4F5] text-[17px] md:text-[18px] leading-[1.88] mb-4 border-l-2 border-[#E5997B]/50 pl-5"
                style={{ opacity: 0.85 }}>
                {p.description[0]}
              </p>
              {p.description[1] && (
                <p className="font-body text-[#F4F4F5]/70 text-[16px] md:text-[17px] leading-[1.82] mb-5 pl-5">
                  {p.description[1]}
                </p>
              )}

              {/* Features */}
              <div className="mb-7">
                <p className="font-mono text-[10px] tracking-[0.5em] uppercase text-[#E5997B]/70 mb-3">Características</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
                  {p.features.map((f, fi) => (
                    <div key={f} className="flex items-start gap-2">
                      <span className="font-mono text-[#E5997B]/65 text-[10px] mt-0.5 shrink-0">{String(fi+1).padStart(2,'0')}</span>
                      <span className="font-body text-[#F4F4F5] text-[14px] leading-relaxed">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA — wider, bigger text, centered */}
              <Link to={p.ctaLink} className="group inline-flex items-center gap-0 w-fit">
                <div className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#E5997B] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"/>
                  <div className="relative border border-[#E5997B]/50 group-hover:border-[#E5997B] px-10 py-3 flex items-center justify-center transition-colors duration-300">
                    <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-[#E5997B] group-hover:text-[#030035] transition-colors duration-300">
                      Conocer más
                    </span>
                  </div>
                </div>
                <div className="border border-l-0 border-[#E5997B]/20 group-hover:border-[#E5997B]/50 px-4 py-3 flex items-center justify-center transition-colors duration-300">
                  <svg className="w-3.5 h-3.5 text-[#E5997B]/40 group-hover:text-[#E5997B] group-hover:translate-x-0.5 transition-all duration-300" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </Link>

            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="absolute bottom-0 left-0 right-0 z-30 border-t border-[#F4F4F5]/[0.05]">
        <div className="h-[2px] bg-[#F4F4F5]/[0.04]">
          <motion.div className="h-full bg-[#E5997B]"
            animate={{ width: `${((active + 1) / products.length) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}/>
        </div>
        <div className="flex">
          {products.map((prod, i) => (
            <button key={prod.number} onClick={() => scrollToProduct(i)}
              className="relative flex-1 flex flex-col items-start gap-1 px-4 py-3 transition-all duration-400 hover:bg-[#F4F4F5]/[0.025] text-left overflow-hidden">
              <span className="font-mono text-[7px] tracking-[0.4em] uppercase transition-colors duration-400"
                style={{ color: active === i ? '#E5997B' : 'rgba(244,244,245,0.18)' }}>
                {prod.number}
              </span>
              <span className="font-display text-[10px] md:text-xs leading-tight truncate w-full transition-colors duration-400"
                style={{ color: active === i ? 'rgba(244,244,245,0.88)' : 'rgba(244,244,245,0.18)' }}>
                {prod.label}
              </span>
            </button>
          ))}
        </div>
      </div>

    </div>
  )
}