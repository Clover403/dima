// ═══════════════════════════════════════════════════════════════
// HOME NEW - SIMPLE TEXT CONTENT FILE
// ═══════════════════════════════════════════════════════════════
// Copy this file + Home.tsx file to AI, dan AI bisa langsung paham
// dan ubah teksnya. SUPER SIMPLE!
// ═══════════════════════════════════════════════════════════════

// TEKS 1 - HERO SECTION
export const TEKS_1_HERO = {
  eyebrow: 'Dima / home baru',
  title: 'Capital engineering, shaped like a seamless brand experience.',
  description: 'Home baru ini disusun sebagai satu alur visual yang halus: hero yang kuat, transisi lembut, dan isi data yang tetap lengkap.',
  ctaPrimary: { label: 'Start a project', to: '/contacto' },
  ctaSecondary: { label: 'Open legacy home', to: '/home-lama' },
}

// TEKS 2 - WHO WE ARE (QUIÉNES SOMOS)
export const TEKS_2_WHO_WE_ARE = {
  eyebrow: 'QUIÉNES SOMOS',
  title: 'Somos arquitectura financiera con precisión humana.',
  description: 'Kami bantu bisnis tumbuh lewat struktur kredit yang jernih, cepat, dan terukur—menggabungkan disiplin analitis, pemahaman sektor, dan eksekusi yang bisa langsung dipakai tim Anda.',
  ctaPrimary: { label: 'Conoce Dima', to: '/nosotros' },
  ctaSecondary: { label: 'Habla con un asesor', to: '/contacto' },
}

// TEKS 3 - PRODUCTS (CRÉDITO)
export const TEKS_3_PRODUCTS = {
  eyebrow: 'Crédito / products',
  title: 'Product pages that feel like one continuous motion.',
  description: 'Crédito Simple, Puente, dan lainnya tetap hadir, tapi sekarang seperti galeri editorial yang menyatu.',
  ctaPrimary: { label: 'View products', to: '/productos' },
  ctaSecondary: { label: 'See services', to: '/servicios' },
}

// TEKS 4 - SERVICES / MODEL
export const TEKS_4_SERVICES = {
  eyebrow: 'Modelo / services',
  title: 'The diamond lands at center, then the narrative expands.',
  description: 'Saat berlian tiba di tengah, teks berpindah ke model crediticio supaya alurnya terasa berkembang.',
  ctaPrimary: { label: 'View model', to: '/modelo-crediticio' },
  ctaSecondary: { label: 'Our process', to: '/proceso' },
}

// TEKS 5 - PRINCIPLES / FINALE
export const TEKS_5_FINALE = {
  eyebrow: 'Principles / finale',
  title: 'Every section keeps the same visual language.',
  description: 'Langkah terakhir menyatukan prinsip dan CTA final agar tetap premium di setiap scroll.',
  ctaPrimary: { label: 'Agenda Llamada', to: '/contacto' },
  ctaSecondary: { label: 'View Legacy', to: '/home-lama' },
}

// ALL TEXTS ARRAY (untuk loop)
export const ALL_TEXTS = [TEKS_1_HERO, TEKS_2_WHO_WE_ARE, TEKS_3_PRODUCTS, TEKS_4_SERVICES, TEKS_5_FINALE]

// PRODUCTS DATA (6 produk)
export const PRODUCTS_DATA = [
  { name: 'Crédito Simple', tagline: 'Anticipo del gasto enfocado en expandir la capacidad instalada.' },
  { name: 'Crédito Puente', tagline: 'Sincronización del flujo de efectivo con el avance de obra.' },
  { name: 'Cuenta Corriente', tagline: 'Mitigación táctica en el ciclo de conversión de efectivo.' },
  { name: 'Crédito Agroindustrial', tagline: 'Calibración del financiamiento a la maduración di activos biológicos.' },
  { name: 'Arrendamiento Financiero', tagline: 'Uso de activos productivos con máxima eficienca de capital.' },
  { name: 'Factoring', tagline: 'Aceleración estratégica del ciclo de conversión de efectivo.' },
]

// SERVICES DATA (3 layanan)
export const SERVICES_DATA = [
  { number: '01', name: 'Estructuración de Deuda', description: 'Rediseñamos la arquitectura financiera de tu empresa para maximizar la productividad y minimizar el costo de capital.' },
  { number: '02', name: 'Análisis de Riesgo Crediticio', description: 'Evaluación profunda basada en modelos macroeconómicos y análisis sectorial del contexto mexicano.' },
  { number: '03', name: 'Planeación Financiera Estratégica', description: 'Diseñamos roadmaps financieros alineados a tus objetivos de crecimiento a mediano y largo plazo.' },
]

// PRINCIPLES DATA (3 prinsip)
export const PRINCIPLES_DATA = [
  { quote: 'No dejes que la deuda crezca más rápido que el ingreso, porque la carga de tus deudas eventualmente te aplastará.', label: 'Causalidad Productiva' },
  { quote: 'No dejes que los ingresos crezcan más rápido que la productividad, porque con el tempo perderás competitividad.', label: 'Eficiencia Operativa' },
  { quote: 'Haz todo lo posible por aumentar tu productividad, porque en el largo plazo es lo que más importa.', label: 'Financiamiento Tractor' },
]
