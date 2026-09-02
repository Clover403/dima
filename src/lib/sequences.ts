const R2_BASE_URL = import.meta.env.VITE_R2_BASE_URL || '';

// Model Videos (Cloudflare R2)
export const modelHeroVideoUrl = R2_BASE_URL
  ? `${R2_BASE_URL}/video/models/hero-model-scroll.mp4`
  : '/video/hero-model-scroll.mp4';

export const modelPrincipiosVideoUrl = R2_BASE_URL
  ? `${R2_BASE_URL}/video/models/Candles-scroll.mp4`
  : '/video/Candles-scroll.mp4';

// Home Sequence Frames
export const hero1Frames = Array.from({ length: 176 }, (_, i) => `${R2_BASE_URL}/hero1_re/ezgif-frame-${String(i + 1).padStart(3, '0')}.webp`);
export const hero2Frames = Array.from({ length: 176 }, (_, i) => `${R2_BASE_URL}/hero2_re/ezgif-frame-${String(i + 1).padStart(3, '0')}.webp`);
export const homeSequenceFrames = [...hero1Frames, ...hero2Frames];

// Model Sequence Frames (Used for iOS/Safari fallback)
export const models1Frames = Array.from({ length: 136 }, (_, i) => `${R2_BASE_URL}/models1_re/ezgif-frame-${String(i + 1).padStart(3, '0')}.webp`);
export const models2Frames = Array.from({ length: 136 }, (_, i) => `${R2_BASE_URL}/models2_re/ezgif-frame-${String(i + 1).padStart(3, '0')}.webp`);
export const models3Frames = Array.from({ length: 240 }, (_, i) => `${R2_BASE_URL}/models3_re/ezgif-frame-${String(i + 1).padStart(3, '0')}.webp`);

export const modelHeroSequenceFrames = [...models1Frames, ...models2Frames];
export const modelPrincipiosSequenceFrames = models3Frames;
export const modelSequenceFrames = [...models1Frames, ...models2Frames, ...models3Frames];

// About (Nosotros) Sequence Frames
export const nosotros1Frames = Array.from({ length: 176 }, (_, i) => `${R2_BASE_URL}/nosotros1_re/ezgif-frame-${String(i + 1).padStart(3, '0')}.webp`);
export const nosotros2Frames = Array.from({ length: 144 }, (_, i) => `${R2_BASE_URL}/nosotros2_re/ezgif-frame-${String(i + 1).padStart(3, '0')}.webp`);
export const nosotros3Frames = Array.from({ length: 176 }, (_, i) => `${R2_BASE_URL}/nosotros3_re/ezgif-frame-${String(i + 1).padStart(3, '0')}.webp`);
export const nosotrosSequenceFrames = [...nosotros1Frames, ...nosotros2Frames, ...nosotros3Frames];
