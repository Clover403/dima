// src/components/proceso/ProcesodiagramaInteractivo.tsx
// Split-screen layout: diagram kiri (55%) — content panel kanan (45%)
// Interaksi: klik node → panel kanan update, diagram tidak kemana-mana
// Referensi: cornrevolution.resn.global/#science

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
import RightPanel from "./ProcesodiagramaRightPanel";
import type { NodeId } from "./ProcesodiagramaData";
import {
  C,
  NODES,
  CONNECTIONS,
  getLineAnchor,
  nodeStyle,
  LABEL_OFFSETS,
  FASE_LABELS,
  LOOP_SMALL,
  LOOP_LARGE,
  NODE_DISPLAY_SHIFT,
  NODE_DISPLAY_OVERRIDES,
} from "./ProcesodiagramaData";

// ─── Komponen utama ───────────────────────────────────────────────────────────
export default function ProcesodiagramaInteractivo() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState<NodeId | null>(null);

  const activeNode = NODES.find((n) => n.id === active) ?? null;

  const isConnectedToActive = (nodeId: NodeId) => {
    if (!active) return false;
    if (active === nodeId) return false;
    return CONNECTIONS.some(
      ([a, b]) =>
        (a === active && b === nodeId) || (a === nodeId && b === active),
    );
  };

  // ── Particle canvas ───────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf: number;
    let pts: { x: number; y: number; vx: number; vy: number; r: number }[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      pts = Array.from(
        { length: Math.floor((canvas.width * canvas.height) / 10000) },
        () => ({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          r: Math.random() * 1.4 + 0.4,
        }),
      );
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(244,244,245,0.40)";
        ctx.fill();
      });
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 115) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(244,244,245,${0.16 - d / 900})`;
            ctx.lineWidth = 0.7;
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    draw();
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  // ── GSAP entrance + ambient animations ───────────────────────────────────
  useEffect(() => {
    if (!wrapperRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        wrapperRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 88%",
            once: true,
          },
        },
      );
      gsap.fromTo(
        ".proc-node",
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: "back.out(1.6)",
          stagger: 0.06,
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 75%",
            once: true,
          },
          transformOrigin: "center center",
        },
      );
      gsap.fromTo(
        ".proc-loop",
        { strokeDashoffset: 2200 },
        {
          strokeDashoffset: 0,
          duration: 2.8,
          ease: "power2.inOut",
          stagger: 0.3,
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 72%",
            once: true,
          },
        },
      );
      gsap.to(".energy-left", {
        strokeDashoffset: -1800,
        duration: 14,
        repeat: -1,
        ease: "none",
      });
      gsap.to(".energy-right", {
        strokeDashoffset: 2200,
        duration: 18,
        repeat: -1,
        ease: "none",
      });
    }, wrapperRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={wrapperRef}
      className="relative w-full bg-[#030035] overflow-hidden"
      style={{ minHeight: "100vh", opacity: 0 }}
    >
      <style>{`
@keyframes iteratePulse {
  0%   { transform: scale(1);   opacity: 0.45; }
  100% { transform: scale(1.6); opacity: 0; }
}
.iterate-pulse {
  transform-box: fill-box;
  transform-origin: center;
  animation: iteratePulse 2.2s ease-out infinite;
}
     
     .iterate-pulse {
  transform-box: fill-box;
  transform-origin: center;
}
     
     @keyframes connectedPulse {
  0%, 100% { transform: scale(1);    opacity: 0.25; }
  50%       { transform: scale(1.35); opacity: 0.04; }
}
.connected-pulse-ring {
  animation: connectedPulse 2.4s infinite ease-in-out;
}
        
        @keyframes procActivePulse {
          0%,100% { transform: scale(1);   opacity:.55; }
          50%      { transform: scale(1.45);opacity:.08; }
        }
        .proc-active-ring { animation: procActivePulse 2s infinite ease-in-out; }
        @keyframes procDataFlow {
          from { stroke-dashoffset: 0; }
          to   { stroke-dashoffset: -130; }
        }
        .proc-data-flow { animation: procDataFlow 1.4s linear infinite; }
        @keyframes connectedGlow {
          0% { opacity: 0.15; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.8); }
        }
        .connected-glow-ring {
          animation: connectedGlow 2.5s ease-out infinite;
        }
      `}</style>

      {/* Ambient glow orbs */}
      <div
        className="absolute top-[20%] left-[-8%] w-[38%] aspect-square rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, rgba(0,180,180,0.12) 0%, transparent 70%)`,
        }}
      />
      <div
        className="absolute bottom-[-5%] right-[-5%] w-[24%] aspect-square rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, rgba(229,153,123,0.12) 0%, transparent 70%)`,
        }}
      />

      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0 pointer-events-none mix-blend-screen"
      />

      {/* Section header */}
      <div className="relative z-20 flex items-center gap-4 px-8 md:px-16 pt-12 pb-6">
        <div className="w-8 h-px bg-[#E5997B]/50" />
        <span className="font-mono text-[#E5997B] text-[10px] tracking-[0.6em] uppercase">
          Diagrama del Proceso
        </span>
      </div>

      {/* Split-screen layout - TANPA GARIS PEMISAH */}
      <div
        className="relative z-10 flex flex-col lg:flex-row w-full"
        style={{ minHeight: "calc(100vh - 80px)" }}
      >
        {/* ════════════════════════════════════════════
            KIRI — SVG Diagram (55%)
        ════════════════════════════════════════════ */}
        <div className="relative lg:w-[55%] flex flex-col items-center justify-center px-2 md:px-6 py-8 lg:py-12 lg:sticky lg:top-0 lg:h-screen overflow-visible">
          {/* Axis arrows top */}
          <div className="absolute top-6 left-4 right-4 flex justify-between px-4 pointer-events-none z-10">
            <div className="flex items-center gap-2">
              <svg width="28" height="8" viewBox="0 0 28 8" fill="none">
                <path
                  d="M0 4 L22 4 M16 1 L22 4 L16 7"
                  stroke={C.bronze}
                  strokeWidth="1"
                  strokeOpacity="0.35"
                />
              </svg>
              <span className="font-mono text-[9px] tracking-[0.5em] uppercase text-[#F4F4F5]/25">
                Evaluación
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] tracking-[0.5em] uppercase text-[#F4F4F5]/25">
                Consolidación
              </span>
              <svg width="28" height="8" viewBox="0 0 28 8" fill="none">
                <path
                  d="M28 4 L6 4 M12 1 L6 4 L12 7"
                  stroke={C.bronze}
                  strokeWidth="1"
                  strokeOpacity="0.35"
                />
              </svg>
            </div>
          </div>

          {/* SVG */}
          <svg
            ref={svgRef}
            viewBox="0 -40 1020 620"
            className="w-full h-auto max-h-[65vh]"
            fill="none"
            style={{ overflow: "visible" }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <filter
                id="pdi-glow"
                x="-60%"
                y="-60%"
                width="220%"
                height="220%"
              >
                <feGaussianBlur stdDeviation="10" result="b" />
                <feComposite in="SourceGraphic" in2="b" operator="over" />
              </filter>
              <filter
                id="pdi-soft"
                x="-30%"
                y="-30%"
                width="160%"
                height="160%"
              >
                <feGaussianBlur stdDeviation="4" result="b" />
                <feComposite in="SourceGraphic" in2="b" operator="over" />
              </filter>
              <filter
                id="connected-glow-filter"
                x="-100%"
                y="-100%"
                width="300%"
                height="300%"
              >
                <feGaussianBlur stdDeviation="12" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* SHIFT GROUP: move diagram slightly right so circles/lines aren't clipped */}
            <g transform="translate(60,0)">

              {/* Y-axis label */}
              <text
                x="18"
                y="185"
                textAnchor="middle"
                fontSize="9"
                fontFamily="'Inter Tight',monospace"
                fill={C.white}
                fillOpacity="0.18"
                letterSpacing="4"
                transform="rotate(-90, 18, 185)"
              >
                PRÁCTICA
              </text>
              <text
                x="18"
                y="390"
                textAnchor="middle"
                fontSize="9"
                fontFamily="'Inter Tight',monospace"
                fill={C.white}
                fillOpacity="0.18"
                letterSpacing="4"
                transform="rotate(-90, 18, 390)"
              >
                TEORÍA
              </text>

              {/* VERTICAL DIVIDER DIHAPUS - tidak ada garis pemisah */}

              {/* Fase labels at bottom */}
              {FASE_LABELS.map((f, i) => (
                <text
                  key={i}
                  x={f.x}
                  y="565"
                  textAnchor="middle"
                  fontSize="13"
                  fontFamily="'Inter Tight',monospace"
                  letterSpacing="1.5"
                  fill={f.color}
                  fillOpacity="0.55"
                >
                  {f.text}
                </text>
              ))}

              {/* Phase brackets bottom */}
              <line
                x1="50"
                y1="552"
                x2="470"
                y2="552"
                stroke={C.teal}
                strokeWidth="0.8"
                strokeOpacity="0.3"
              />
              <line
                x1="520"
                y1="552"
                x2="1000"
                y2="552"
                stroke={C.bronze}
                strokeWidth="0.8"
                strokeOpacity="0.3"
              />

              {/* Loop paths */}
              <path
                className="proc-loop"
                d={LOOP_SMALL}
                stroke={C.teal}
                strokeWidth="1.2"
                strokeOpacity="0.22"
                strokeDasharray="2200"
                strokeDashoffset="2200"
              />
              <path
                className="proc-loop"
                d={LOOP_LARGE}
                stroke={C.bronze}
                strokeWidth="1.2"
                strokeOpacity="0.22"
                strokeDasharray="2200"
                strokeDashoffset="2200"
              />

              {/* Energy flow */}
              <path
                className="energy-left"
                d={LOOP_SMALL}
                stroke={C.teal}
                strokeWidth="1.8"
                strokeOpacity="0.35"
                strokeDasharray="55 1500"
                filter="url(#pdi-soft)"
                style={{ mixBlendMode: "screen" }}
              />
              <path
                className="energy-right"
                d={LOOP_LARGE}
                stroke={C.bronze}
                strokeWidth="1.8"
                strokeOpacity="0.35"
                strokeDasharray="55 1500"
                filter="url(#pdi-soft)"
                style={{ mixBlendMode: "screen" }}
              />

              {/* Connections */}
              {CONNECTIONS.map(([a, b], i) => {
                const na = NODES.find((n) => n.id === a)!;
                const nb = NODES.find((n) => n.id === b)!;
                const A = getLineAnchor(na);
                const B = getLineAnchor(nb);
                const isConnected =
                  active !== null && (active === a || active === b);
                const connColor = ["1", "2", "3", "4"].includes(a)
                  ? C.teal
                  : C.bronze;
                return (
                  <g key={`c-${i}`}>
                    <line
                      x1={A.x}
                      y1={A.y}
                      x2={B.x}
                      y2={B.y}
                      stroke={isConnected ? C.white : C.whiteDim}
                      strokeWidth={isConnected ? 1.2 : 0.6}
                      strokeOpacity={isConnected ? 0.5 : 0.12}
                      style={{ transition: "all 0.3s ease" }}
                    />
                    {isConnected && (
                      <line
                        className="proc-data-flow"
                        x1={A.x}
                        y1={A.y}
                        x2={B.x}
                        y2={B.y}
                        stroke={connColor}
                        strokeWidth="2.5"
                        strokeOpacity="0.9"
                        strokeDasharray="9 120"
                        filter="url(#pdi-soft)"
                      />
                    )}
                  </g>
                );
              })}

              {/* Nodes */}
              {NODES.map((n) => {
                const s = nodeStyle(n, active);
                const isIt = n.id === "iterate";
                const isAct = active === n.id;
                const isConnected = isConnectedToActive(n.id);
                const lbl = LABEL_OFFSETS[n.id];
                const nodeGlowColor =
                  n.phase === "identificacion" ? C.teal : C.bronze;

                const dx = NODE_DISPLAY_SHIFT.x;
                const dy = NODE_DISPLAY_SHIFT.y;
                // AFTER
                const displayExtra = NODE_DISPLAY_OVERRIDES[n.id] ?? {
                  x: 0,
                  y: 0,
                };
                const dxCx = n.cx + dx + displayExtra.x;
                const dxCy = n.cy + dy + displayExtra.y;

                return (
                  <g
                    key={n.id}
                    className="proc-node"
                    onClick={() =>
                      setActive((prev) => (prev === n.id ? null : n.id))
                    }
                    style={{
                      cursor: "pointer",
                      opacity: s.opacity,
                      transition: "opacity 0.3s ease",
                    }}
                  >
                    {/* Active glow rings */}
                    {isAct && (
                      <>
                        <circle
                          className="proc-active-ring"
                          cx={dxCx}
                          cy={dxCy}
                          r={n.r + 10}
                          fill="none"
                          stroke={s.glow}
                          strokeWidth="3.5"
                          filter="url(#pdi-glow)"
                          style={{ transformOrigin: `${dxCx}px ${dxCy}px` }}
                        />
                        <circle
                          cx={dxCx}
                          cy={dxCy}
                          r={n.r + 28}
                          fill={s.glow}
                          opacity="0.15"
                          filter="url(#pdi-glow)"
                        />
                      </>
                    )}

                    {/* Connected glow rings (subtle, same family as idle look) */}
                    {!isAct && isConnected && (
                      <>
                        <circle
                          className="proc-active-ring"
                          cx={dxCx}
                          cy={dxCy}
                          r={n.r + 6}
                          fill="none"
                          stroke={nodeGlowColor}
                          strokeWidth="2"
                          strokeOpacity="0.2"
                          filter="url(#pdi-glow)"
                        />
                        <circle
                          className="connected-glow-ring"
                          cx={dxCx}
                          cy={dxCy}
                          r={n.r + 8}
                          fill="none"
                          stroke={nodeGlowColor}
                          strokeWidth="2"
                          strokeOpacity="0.6"
                          filter="url(#connected-glow-filter)"
                          style={{ transformOrigin: `${dxCx}px ${dxCy}px` }}
                        />
                        <circle
                          cx={dxCx}
                          cy={dxCy}
                          r={n.r + 18}
                          fill={nodeGlowColor}
                          fillOpacity="0.12"
                          filter="url(#pdi-glow)"
                        />
                      </>
                    )}

                    {/* Idle dashed ring */}
                 /* AFTER */
                    {!isAct && isConnected && (
                      <>
                        <circle
                          className="connected-pulse-ring"
                          cx={dxCx} cy={dxCy} r={n.r + 10}
                          fill="none"
                          stroke={nodeGlowColor}
                          strokeWidth="3"
                          filter="url(#pdi-glow)"
                          style={{ transformOrigin: `${dxCx}px ${dxCy}px` }}
                        />
                        <circle
                          cx={dxCx} cy={dxCy} r={n.r + 22}
                          fill={nodeGlowColor}
                          fillOpacity="0.18"
                          filter="url(#pdi-glow)"
                        />
                        <circle
                          cx={dxCx} cy={dxCy} r={n.r + 5}
                          fill={nodeGlowColor}
                          fillOpacity="0.12"
                          filter="url(#pdi-soft)"
                        />
                      </>
                    )}



                    {/* Node body */}
                    <circle
                      cx={dxCx}
                      cy={dxCy}
                      r={n.r}
                      fill={s.fill}
                      stroke={s.stroke}
                      strokeWidth={s.strokeWidth}
                      style={{ transition: "fill 0.3s ease, stroke 0.3s ease" }}
                    />

                    {/* Number / ITERAR label */}
                    <text
                      x={dxCx}
                      y={dxCy + 5}
                      textAnchor="middle"
                      fontSize={isIt ? 12 : 15}
                      fontFamily={
                        isIt
                          ? "'Playfair Display',serif"
                          : "'Inter Tight',sans-serif"
                      }
                      fontStyle={isIt ? "italic" : "normal"}
                      fontWeight={isIt ? "400" : "600"}
                      fill={s.labelColor}
                      className="pointer-events-none select-none"
                      style={{ transition: "fill 0.3s ease" }}
                    >
                      {n.label}
                    </text>

                    {/* External name label */}
                    {!isIt && lbl && (
                      <text
                        x={dxCx + lbl.dx}
                        y={dxCy + lbl.dy}
                        textAnchor={lbl.anchor}
                        fontSize="17"
                        fontFamily="'Inter Tight',monospace"
                        fill={isAct || isConnected ? C.white : C.white}
                        fillOpacity={isAct || isConnected ? 0.9 : 0.5}
                        fontWeight={isAct || isConnected ? "500" : "400"}
                        letterSpacing="0.5"
                        className="pointer-events-none select-none"
                        style={{ transition: "fill-opacity 0.3s ease" }}
                      >
                        {n.title.split(" ")[0]}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Center ¿Viabilidad? label */}
              <text
                x="490"
                y="400"
                textAnchor="middle"
                fontSize="8"
                fontFamily="'Inter Tight',monospace"
                fill={C.white}
                fillOpacity="0.18"
                letterSpacing="1.5"
              >
                ¿Viabilidad / Intervención?
              </text>

            </g>
          </svg>

          {/* Fase label row bottom */}
          <div className="flex justify-around w-full mt-3 px-4 pointer-events-none">
            {[
              { label: "Fase de Identificación", color: C.teal },
              { label: "Fase de Consolidación", color: C.bronze },
            ].map((f, i) => (
              <span
                key={i}
                className="font-mono text-[11px] uppercase tracking-[0.38em]"
                style={{ color: f.color, opacity: 0.55 }}
              >
                {f.label}
              </span>
            ))}
          </div>
        </div>

        <RightPanel active={active} activeNode={activeNode} setActive={setActive} />
      </div>

      {/* ── Bottom full-width label ── */}
      <div className="relative z-10 pb-8 text-center">
        <p className="font-mono text-[11px] tracking-[0.38em] uppercase text-[#F4F4F5]/25">
          Diagnóstico e Ideación Estructural&nbsp;·&nbsp; Due Diligence y
          Reingeniería de Riesgos&nbsp;·&nbsp; Modelado, Despliegue y
          Escalabilidad
        </p>
      </div>
    </section>
  );
}
