// Shared data and helpers for ProcesodiagramaInteractivo
export type NodeId =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "iterate"
  | "6"
  | "7"
  | "8"
  | "9";
export type Phase =
  | "identificacion"
  | "pivot"
  | "iterate"
  | "consolidacion";

export interface NodeDef {
  id: NodeId;
  label: string;
  title: string;
  phase: Phase;
  tag: string;
  description: string;
  cx: number;
  cy: number;
  r: number;
}

export const C = {
  navy: "#030035",
  bronze: "#E5997B",
  bronzeDim: "rgba(229,153,123,0.22)",
  bronzeFaint: "rgba(229,153,123,0.07)",
  white: "#F4F4F5",
  whiteDim: "rgba(244,244,245,0.14)",
  whiteFaint: "rgba(244,244,245,0.04)",
  teal: "#00B4B4",
  tealDim: "rgba(0,180,180,0.18)",
  tealFaint: "rgba(0,180,180,0.07)",
};

export const NODES: NodeDef[] = [
  {
    id: "1",
    label: "01",
    title: "Diagnóstico Estructural",
    phase: "identificacion",
    tag: "Fase de Identificación",
    description:
      'Revisión integral del perfil corporativo: escalabilidad, estructura de capital, historial crediticio y mapeo de activos. DIMA realiza un ejercicio de empatía financiera para entender la "genética" del negocio antes de proponer cualquier instrumento.',
    cx: 100,
    cy: 420,
    r: 32,
  },
  {
    id: "2",
    label: "02",
    title: "Alineación de Condiciones",
    phase: "identificacion",
    tag: "Fase de Identificación",
    description:
      "Con base en el diagnóstico, se determina el producto financiero preliminar y se inicia el intercambio de métricas detalladas: valuaciones de activos, tasas institucionales vigentes, plazos de amortización y esquemas de garantía posibles.",
    cx: 100,
    cy: 160,
    r: 32,
  },
  {
    id: "3",
    label: "03",
    title: "Sincronización Institucional",
    phase: "identificacion",
    tag: "Fase de Identificación",
    description:
      "DIMA actúa como enlace técnico entre la empresa y las SOFOMEs, instituciones financieras y fondeadores aliados. Se presenta el vehículo financiero preliminar ante los comités de crédito para obtener una pre-aprobación técnica.",
    cx: 275,
    cy: 80,
    r: 32,
  },
  {
    id: "4",
    label: "04",
    title: "Recopilación y Validación",
    phase: "identificacion",
    tag: "Fase de Identificación",
    description:
      "Due diligence multidisciplinario: legal, fiscal, contable y financiero. Se aplica el Modelo de Ingeniería Económica adaptado de Ray Dalio para determinar la viabilidad estructural y la solvencia inicial de la entidad solicitante.",
    cx: 410,
    cy: 280,
    r: 36,
  },
  {
    id: "5",
    label: "05",
    title: "Evaluación de Viabilidad",
    phase: "pivot",
    tag: "Punto de Inflexión",
    description:
      "Evaluación crítica de los criterios de exclusión del sistema financiero. Validaciones de buró de crédito, integridad reputacional y riesgo sistémico. Aquí se decide si la empresa avanza, itera con DIMA o es descartada del proceso.",
    cx: 400,
    cy: 440,
    r: 32,
  },
  {
    id: "iterate",
    label: "ITERAR",
    title: "Intervención Estratégica",
    phase: "iterate",
    tag: "Protocolo de Reconfiguración",
    description:
      "Cuando la evaluación detecta solvencia subóptima, DIMA no rechaza — interviene. Se activa el protocolo de transformación activa del balance corporativo: reestructuración de pasivos, mejora de ratios financieros y fortalecimiento patrimonial. Ninguna empresa avanza a Fase 03 sin superar este filtro.",
    cx: 570,
    cy: 340,
    r: 50,
  },
  {
    id: "6",
    label: "06",
    title: "Integración Documental",
    phase: "consolidacion",
    tag: "Fase de Consolidación",
    description:
      "Organización y formalización del expediente crediticio auditable. Se aplica el Modelo de Ingeniería Económica para mapear la genética financiera del negocio — validando solvencia y determinando el cómo, el cuánto y el por qué de la generación de valor.",
    cx: 720,
    cy: 200,
    r: 32,
  },
  {
    id: "7",
    label: "07",
    title: "Formalización",
    phase: "consolidacion",
    tag: "Fase de Consolidación",
    description:
      "Estructuración y firma de contratos financieros. Formalización legal del instrumento de crédito bajo las condiciones técnicas definidas durante el proceso. DIMA coordina todas las partes institucionales para la ejecución precisa del desembolso.",
    cx: 880,
    cy: 120,
    r: 32,
  },
  {
    id: "8",
    label: "08",
    title: "Dispersión",
    phase: "consolidacion",
    tag: "Fase de Consolidación",
    description:
      "Ejecución del desembolso del capital. DIMA coordina el flujo de fondos entre fondeadores, la empresa y todas las partes involucradas. Se verifica que el capital se canalice exactamente hacia la productividad declarada en el expediente.",
    cx: 1020,
    cy: 340,
    r: 32,
  },
  {
    id: "9",
    label: "09",
    title: "Gobernanza y Escalabilidad",
    phase: "consolidacion",
    tag: "Fase de Consolidación",
    description:
      "La relación no termina con el desembolso — escala con el negocio. DIMA acompaña el monitoreo del desempeño del crédito, implementa mecanismos de gobernanza financiera continua y prepara a la empresa para ciclos crediticios futuros más eficientes.",
    cx: 880,
    cy: 500,
    r: 32,
  },
];

export const CONNECTIONS: [NodeId, NodeId][] = [
  ["1", "2"],
  ["2", "3"],
  ["3", "4"],
  ["1", "4"],
  ["4", "iterate"],
  ["5", "iterate"],
  ["4", "5"],
  ["iterate", "6"],
  ["6", "7"],
  ["7", "8"],
  ["8", "9"],
  ["6", "9"],
];

export const BASE_LINE_OFFSET = { x: -50, y: -50 };
export const NODE_LINE_OVERRIDES: Partial<Record<NodeId, { x: number; y: number }>> = {};
export const NODE_DISPLAY_OVERRIDES: Partial<Record<NodeId, { x: number; y: number }>> = {
  "4": { x: 38, y: -10 },
  "8": { x: 28, y: -10 },
};

export function getLineAnchor(node: NodeDef) {
  const o = NODE_LINE_OVERRIDES[node.id] ?? { x: 0, y: 0 };
  return {
    x: node.cx + BASE_LINE_OFFSET.x + o.x,
    y: node.cy + BASE_LINE_OFFSET.y + o.y,
  };
}

export const NODE_DISPLAY_SHIFT = { x: 0, y: 0 };

export const LABEL_OFFSETS: Record<string, { dx: number; dy: number; anchor: "start" | "middle" | "end" }> = {
  "1": { dx: 0, dy: 52, anchor: "middle" },
  "2": { dx: 0, dy: -44, anchor: "middle" },
  "3": { dx: 0, dy: -46, anchor: "middle" },
  "4": { dx: -55, dy: 4, anchor: "end" },
  "5": { dx: 0, dy: 52, anchor: "middle" },
  "6": { dx: 0, dy: -46, anchor: "middle" },
  "7": { dx: 0, dy: -46, anchor: "middle" },
  "8": { dx: -55, dy: 4, anchor: "end" },
  "9": { dx: 0, dy: 52, anchor: "middle" },
};

export const FASE_LABELS = [
  { x: 240, color: C.teal, text: "Diagnóstico e Ideación Estructural" },
  { x: 530, color: "#F4F4F5", text: "Due Diligence y Reingeniería de Riesgos" },
  { x: 840, color: C.bronze, text: "Modelado, Implementación y Escalabilidad" },
];

export const LOOP_SMALL =
  "M 60 290 C 60 20, 360 20, 360 290 C 360 560, 60 560, 60 290 Z";
export const LOOP_LARGE =
  "M 580 280 C 580 20, 1010 20, 1010 280 C 1010 540, 580 540, 580 280 Z";

export function nodeStyle(n: NodeDef, active: NodeId | null) {
  const isActive = active === n.id;
  const isOther = active !== null && !isActive;
  const isIterate = n.id === "iterate";

  const phaseStyles: Record<
    Phase,
    { fill: string; stroke: string; activeFill: string; glow: string }
  > = {
    identificacion: {
      fill: C.tealFaint,
      stroke: C.teal,
      activeFill: C.teal,
      glow: "rgba(0,180,180,0.65)",
    },
    pivot: {
      fill: C.bronzeFaint,
      stroke: "rgba(229,153,123,0.45)",
      activeFill: C.bronze,
      glow: "rgba(229,153,123,0.65)",
    },
    iterate: {
      fill: C.bronzeDim,
      stroke: C.bronze,
      activeFill: C.bronze,
      glow: "rgba(229,153,123,0.7)",
    },
    consolidacion: {
      fill: C.bronzeFaint,
      stroke: C.bronze,
      activeFill: C.bronze,
      glow: "rgba(229,153,123,0.65)",
    },
  };

  const p = phaseStyles[n.phase];

  return {
    fill: isActive ? p.activeFill : isIterate ? C.bronzeDim : p.fill,
    stroke: isActive ? C.white : p.stroke,
    strokeWidth: isActive ? 2 : isIterate ? 2 : 1.5,
    opacity: isOther ? 0.28 : 1,
    glow: p.glow,
    labelColor: isActive ? C.navy : C.white,
  };
}
