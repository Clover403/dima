import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Wrench, Layers } from 'lucide-react';

interface ElementInfo {
  step: string;
  title: string;
  tag: string;
  summary: string;
  detail: string;
  icon: typeof Wrench;
  highlight: string;
}

const creditElements: ElementInfo[] = [
  {
    step: '01',
    title: 'SOLUCIÓN',
    tag: 'DIAGNÓSTICO ESTRATÉGICO',
    summary: 'Alineación de la necesidad de capital con la capacidad productiva.',
    detail: 'Determinamos con exactitud la función económica del financiamiento: si busca expandir capacidad instalada, optimizar capital de trabajo o refinanciar pasivos para reducir la presión sobre la tesorería.',
    icon: Wrench,
    highlight: 'Propósito Productivo'
  },
  {
    step: '02',
    title: 'INSTRUMENTO',
    tag: 'VEHÍCULO FINANCIERO',
    summary: 'Selección del instrumento técnico más eficiente del mercado.',
    detail: 'Elegimos la figura legal y operativa idónea (crédito simple, línea revolvente, arrendamiento puro o financiero, factoraje, estructurado) que optimice el tratamiento fiscal y operativo de la empresa.',
    icon: Layers,
    highlight: 'Eficiencia de Capital'
  },
  {
    step: '03',
    title: 'ESTRUCTURA',
    tag: 'BLINDAJE DE FLUJOS',
    summary: 'Sincronización intertemporal de plazos, garantías y tasas.',
    detail: 'Forjamos una arquitectura invulnerable: amortizaciones calibradas a la estacionalidad de ingresos, colateral optimizado sin sobre-hipotecar y tasas que protejan la rentabilidad a lo largo de todo el ciclo.',
    icon: Shield,
    highlight: 'Inmunidad de Ciclos'
  }
];

export default function CreditArchitectureDiagram() {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <div className="my-1.5 w-full rounded-2xl border border-[#030035]/15 bg-white/85 backdrop-blur-sm p-3.5 sm:p-5 md:p-5 shadow-lg transition-all duration-300">
      {/* Top telemetry bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-[#030035]/10 pb-2.5 mb-4 gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#E5997B] animate-pulse" />
          <span className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.18em] text-[#030035]/80 font-semibold">
            ARQUITECTURA DEL CRÉDITO // SISTEMA TRIPARTITO
          </span>
        </div>
        <div className="font-mono text-[10px] sm:text-[11px] text-[#030035]/50 tracking-widest">
          SYS.MODEL-DIMA // REV.2026
        </div>
      </div>

      {/* 3 Interactive Element Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 mb-4">
        {creditElements.map((elem, idx) => {
          const Icon = elem.icon;
          const isSelected = activeTab === idx;

          return (
            <button
              type="button"
              key={elem.step}
              onClick={() => setActiveTab(idx)}
              className={`relative text-left p-3 sm:p-3.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                isSelected
                  ? 'bg-[#E5997B]/15 text-[#030035] border-[#E5997B] shadow-[0_2px_12px_rgba(229,153,123,0.3)] scale-[1.01]'
                  : 'bg-[#030035]/[0.03] text-[#030035]/75 border-[#030035]/10 hover:border-[#030035]/30 hover:bg-[#030035]/[0.06]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`font-mono text-[11px] sm:text-xs font-bold tracking-wider ${
                    isSelected ? 'text-[#E5997B]' : 'text-[#030035]/40'
                  }`}
                >
                  {elem.step}
                </span>
                <Icon
                  size={16}
                  className={isSelected ? 'text-[#E5997B]' : 'text-[#030035]/40'}
                />
              </div>

              <h4 className="font-body text-xs sm:text-[13.5px] font-semibold tracking-wider text-[#030035] uppercase mb-1">
                {elem.title}
              </h4>
              <p className="text-xs sm:text-[13px] font-body text-[#030035]/80 leading-relaxed">
                {elem.summary}
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Tab Detail Pane */}
      <div className="relative rounded-xl bg-[#030035]/[0.03] border border-[#030035]/10 p-3.5 sm:p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5"
          >
            <div className="flex-1 pr-1">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="font-mono text-xs sm:text-[13px] uppercase font-bold tracking-widest text-[#E5997B]">
                  {creditElements[activeTab].tag}
                </span>
                <span className="text-[#030035]/30">•</span>
                <span className="font-mono text-[11px] sm:text-xs text-[#030035]/60">
                  {creditElements[activeTab].highlight}
                </span>
              </div>
              <p className="text-sm sm:text-[15px] md:text-base text-[#030035]/90 leading-relaxed font-body font-light">
                {creditElements[activeTab].detail}
              </p>
            </div>

            <div className="shrink-0 flex items-center sm:flex-col sm:items-end justify-between border-t sm:border-t-0 sm:border-l border-[#030035]/15 pt-2 sm:pt-0 sm:pl-4">
              <span className="font-mono text-[9px] sm:text-[10px] text-[#030035]/50 tracking-wider">COBERTURA</span>
              <span className="font-mono text-xs sm:text-[13px] font-bold text-[#E5997B] tracking-wider mt-0.5">
                100% BLINDADA
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
