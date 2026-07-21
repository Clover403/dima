import re

with open('src/pages/Home.tsx', 'r') as f:
    content = f.read()

start_chunk1 = content.find('opacity: insideDiamondOpacity')
if start_chunk1 != -1:
    start_chunk1 = content.rfind('<motion.div', 0, start_chunk1)

end_chunk1 = content.find('{/* ── PRODUCTS SEQUENCE ── */}')

if start_chunk1 != -1 and end_chunk1 != -1:
    replacement = '''<BackgroundLayer
                bgX={bgX}
                bgY={bgY}
                fgX={fgX}
                fgY={fgY}
                insideDiamondOpacity={insideDiamondOpacity}
                insideDiamondScale={insideDiamondScale}
                t4HeaderOp={t4HeaderOp}
                t4HeaderY={t4HeaderY}
                diamondX={diamondX}
                diamondY={diamondY}
                diamondZ={diamondZ}
                diamondScale={diamondScale}
                diamondRotate={diamondRotate}
                fig1Y={fig1Y}
                fig2Y={fig2Y}
                figOpacity={figOpacity}
                midX={midX}
                midY={midY}
                tiltX={tiltX}
                tiltY={tiltY}
                ornamentOpacity={ornamentOpacity}
                ornamentDraw={ornamentDraw}
                activeBeat={activeBeat}
                b1Y={b1Y}
                b1StrokeOp={b1StrokeOp}
                b1PathLength={b1PathLength}
                b1FillOp={b1FillOp}
                handlePointClick={handlePointClick}
                teks4Services={TEKS_4_SERVICES}
              />
              '''
    content = content[:start_chunk1] + replacement + content[end_chunk1:]

start_chunk2 = content.find('{/* ── TIMBANGAN DESKTOP DENGAN PARALLAX + TILT ── */}')
end_chunk2_str = '</AnimatePresence>'
if start_chunk2 != -1:
    idx_first_ap = content.find(end_chunk2_str, start_chunk2) + len(end_chunk2_str)
    idx_second_ap = content.find(end_chunk2_str, idx_first_ap) + len(end_chunk2_str)
    end_chunk2 = idx_second_ap
    
    if end_chunk2 != -1:
        content = content[:start_chunk2] + content[end_chunk2:]

if 'import { BackgroundLayer }' not in content:
    idx = content.find('\n', content.rfind("from '../components/NewHome/sections/RayDalioSection'")) + 1
    content = content[:idx] + "import { BackgroundLayer } from '../components/NewHome/sections/BackgroundLayer'\n" + content[idx:]

if '<DimaDiamond3D' not in content:
    content = re.sub(r"import\s*\{\s*DimaDiamond3D\s*\}\s*from\s*'../components/NewHome/DimaDiamond3D'\n?", "", content)

with open('src/pages/Home.tsx', 'w') as f:
    f.write(content)
