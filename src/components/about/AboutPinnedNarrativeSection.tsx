import { useState, type MouseEvent, type RefObject } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import ArchitecturalColumnSVG from '../illustrations/ArchitecturalColumnSVG';

type Props = {
  pinnedRef: RefObject<HTMLDivElement | null>;
};

export default function AboutPinnedNarrativeSection({ pinnedRef }: Props) {
  const [isIconHovered, setIsIconHovered] = useState(false)

  // ── MOUSE PARALLAX ─────────────────────────────────────────────────
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const smoothX = useSpring(mouseX, { stiffness: 60, damping: 18, mass: 0.4 })
  const smoothY = useSpring(mouseY, { stiffness: 60, damping: 18, mass: 0.4 })

  const hudX = useTransform(smoothX, [-0.5, 0.5], [18, -18])
  const hudY = useTransform(smoothY, [-0.5, 0.5], [18, -18])

  const svgX = useTransform(smoothX, [-0.5, 0.5], [12, -12])
  const svgY = useTransform(smoothY, [-0.5, 0.5], [12, -12])

  const textX = useTransform(smoothX, [-0.5, 0.5], [12, -12])
  const textY = useTransform(smoothY, [-0.5, 0.5], [12, -12])

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (isIconHovered) return
    const rect = pinnedRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }
  // ───────────────────────────────────────────────────────────────────

  return (
    <section
      ref={pinnedRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative z-30 w-full h-screen flex px-6 md:px-16 lg:px-24 bg-[#F4F4F5] overflow-hidden"
    >

      {/* ── Depth 1: TECHNICAL HUD OVERLAY ── */}
      <div className="absolute inset-0 pointer-events-none opacity-40 selection:bg-transparent z-30">
        <motion.div 
          style={{ x: hudX, y: hudY }}
          className="absolute top-10 left-10 font-mono text-[10px] text-[#030035]/50 flex flex-col gap-1"
        >
          <span>SYSTEM: DIMA_CORE_v2.0</span>
          <span>MODULE: CONCEPTUAL_NARRATIVE</span>
          <span>COORD: 19.4326° N, 99.1332° W</span>
        </motion.div>

        <div className="absolute top-0 right-0 w-full h-screen pointer-events-none">
          <div className="absolute bottom-6 right-10 font-mono text-[10px] text-[#030035]/50 text-right">
            <span>DATA_STREAM: ACTIVE</span>
            <div className="flex gap-1 items-end mt-1">
              <span className="text-[20px] font-bold text-[#E5997B] leading-none scroll-progress-digit">000</span>
              <span className="mb-[2px]">PROGRESS_VAL</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Architectural Column icon (Kanan) ── */}
      {/*
        KEY FIX: opacity dipindah ke motion.div wrapper ini, bukan di SVG itu sendiri.
        Saat hover, opacity naik dari 0.12 → 0.55 sehingga glow & stroke shift di SVG
        benar-benar terlihat. pointer-events-auto memastikan hover event diterima.
      */}
      <motion.div
        style={{ x: svgX, y: svgY }}
        className="absolute bottom-0 right-12 md:right-58 z-10 w-[22vw] md:w-[38vw] lg:w-[45vw] pointer-events-auto origin-bottom scale-y-[1.18] scale-x-[1.05]"
        initial={{ opacity: 0.12 }}
        whileHover={{ opacity: 0.6 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        onMouseEnter={() => {
          setIsIconHovered(true)
          mouseX.set(0)
          mouseY.set(0)
        }}
        onMouseMove={(e) => {
          e.stopPropagation()
        }}
        onMouseLeave={() => {
          setIsIconHovered(false)
        }}
      >
        <ArchitecturalColumnSVG className="w-full h-auto block" stroke="#030035" />
      </motion.div>

      {/* ── Depth 3: TEXT LAYERS ── */}
      <motion.div
        style={{ x: textX, y: textY }}
        className="w-full h-full flex flex-col justify-center relative z-20 pointer-events-none"
      >

        {/* TEXT 1 */}
        <div className="p-text-1 absolute left-6 md:left-16 lg:left-24 w-[85%] md:w-[70%] lg:w-[60%] flex flex-col gap-5">
          <p className="font-body text-[#E5997B] text-[10px] tracking-[0.4em] uppercase font-semibold">
            Filosofía — 01
          </p>
          <div className="space-y-1">
            <p className="font-display text-6xl md:text-8xl lg:text-9xl text-[#030035] leading-[0.92] tracking-tight">
              No somos un banco.
            </p>
            <p className="font-display text-6xl md:text-8xl lg:text-9xl text-[#030035] leading-[0.92] tracking-tight">
              Somos <em className="text-[#E5997B] not-italic">arquitectos</em>
            </p>
            <p className="font-display text-6xl md:text-8xl lg:text-9xl text-[#030035] leading-[0.92] tracking-tight">
              de equilibrio.
            </p>
          </div>
        </div>

        {/* TEXT 2 */}
        <div className="p-text-2 absolute left-6 md:left-16 lg:left-24 w-[85%] md:w-[70%] lg:w-[60%] flex flex-col gap-5">
          <p className="font-body text-[#E5997B] text-[10px] tracking-[0.4em] uppercase font-semibold">
            Estrategia — 02
          </p>
          <div className="space-y-1">
            <p className="font-display text-6xl md:text-8xl lg:text-9xl text-[#030035] leading-[0.92] tracking-tight">
              Transformamos la
            </p>
            <p className="font-display text-6xl md:text-8xl lg:text-9xl text-[#030035] leading-[0.92] tracking-tight">
              <em className="text-[#E5997B] not-italic">deuda</em> en
            </p>
            <p className="font-display text-6xl md:text-8xl lg:text-9xl text-[#030035] leading-[0.92] tracking-tight">
              productividad.
            </p>
          </div>
        </div>

        {/* TEXT 3 */}
        <div className="p-text-3 absolute left-6 md:left-16 lg:left-24 w-[85%] md:w-[70%] lg:w-[60%] flex flex-col gap-5">
          <p className="font-body text-[#E5997B] text-[10px] tracking-[0.4em] uppercase font-semibold">
            Identidad — 03
          </p>
          <div className="space-y-1">
            <p className="font-display text-6xl md:text-8xl lg:text-9xl text-[#030035] leading-[0.92] tracking-tight">
              No operamos con
            </p>
            <p className="font-display text-6xl md:text-8xl lg:text-9xl text-[#030035] leading-[0.92] tracking-tight">
              <em className="text-[#E5997B] not-italic">intuición</em>.
            </p>
            <p className="font-display text-6xl md:text-8xl lg:text-9xl text-[#030035] leading-[0.92] tracking-tight">
              Operamos con ciclos.
            </p>
          </div>
        </div>

        {/* TEXT 4 */}
        <div className="p-text-4 absolute left-6 md:left-16 lg:left-24 w-[85%] md:w-[70%] lg:w-[60%] flex flex-col gap-6">
          <p className="font-body text-[#E5997B] text-[10px] tracking-[0.4em] uppercase font-semibold">
            Principio DIMA
          </p>
          <blockquote className="font-display italic text-6xl md:text-8xl lg:text-9xl text-[#030035]/90 leading-[0.95] tracking-tight">
            <span className="block">"Replicar para cada</span>
            <span className="block">empresa la misma lógica</span>
            <span className="block">de <em className="text-[#E5997B] not-italic">equilibrio</em>."</span>
          </blockquote>
          <div className="flex items-center gap-4">
            <div className="w-8 h-px bg-[#E5997B]/40" />
            <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-[#030035]/35">
              Filosofía Fundacional DIMA
            </span>
          </div>
        </div>

      </motion.div>

      {/* Scanline bg */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(3,0,53,0.01)_50%,transparent_50%)] bg-[length:100%_4px] z-40" />
    </section>
  );
}