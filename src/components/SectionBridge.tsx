/**
 * SectionBridge.tsx
 *
 * Gradient connector antar section — bikin terasa nyambung
 * tanpa ngerusak GSAP apapun.
 *
 * Cara pakai:
 *   <SectionBridge from="#F4F4F5" to="#E5997B" />
 *
 * Prinsip:
 * - Overlap ke section sebelumnya via negative marginTop
 * - Gradient blend dari warna section sebelumnya ke section berikutnya
 * - Shadow ke bawah bikin ilusi "section baru muncul dari bawah"
 * - Pure CSS, zero JavaScript, zero GSAP conflict
 */

interface SectionBridgeProps {
  from: string   // warna akhir section sebelumnya
  to: string     // warna awal section berikutnya
  height?: number // tinggi bridge dalam px (default 120)
  shadow?: boolean
}

export default function SectionBridge({
  from,
  to,
  height = 120,
  shadow = true,
}: SectionBridgeProps) {
  return (
    <div
      style={{
        position: 'relative',
        zIndex: 5,
        height: `${height}px`,
        marginTop: `-${height / 2}px`,
        marginBottom: `-${height / 2}px`,
        background: `linear-gradient(to bottom, ${from}, ${to})`,
        pointerEvents: 'none',
        ...(shadow && {
          boxShadow: '0 -20px 60px rgba(0,0,0,0.12)',
        }),
      }}
    />
  )
}