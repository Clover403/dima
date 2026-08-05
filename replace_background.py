import re

with open('src/pages/Home.tsx', 'r') as f:
    content = f.read()

# CHUNK 1: From `insideDiamondOpacity` (just after `<motion.canvas ... />`) to just before `<ProductsSequenceLayer`
# Wait, let's look for `<motion.div\n                style={{` ... `opacity: insideDiamondOpacity`
# and end at `</svg>\n                </div>\n              </motion.div>` right before `{/* ── PRODUCTS SEQUENCE ── */}`

start_chunk1 = content.find('style={{\n                  opacity: insideDiamondOpacity,')
if start_chunk1 == -1: # maybe no newline
    start_chunk1 = content.find('style={{ opacity: insideDiamondOpacity,')

# Backtrack to the start of the `<motion.div` tag
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

# CHUNK 2: Timbangan
# From `{/* ── TIMBANGAN DESKTOP DENGAN PARALLAX + TILT ── */}` to just before `{activeBeat > 2 && activeBeat !== 5 && (` (or whatever is next)
# Actually, the Timbangan block ends after `{/* ── TIMBANGAN MOBILE ── */}` and its `</AnimatePresence>`
start_chunk2 = content.find('{/* ── TIMBANGAN DESKTOP DENGAN PARALLAX + TILT ── */}')
end_chunk2_str = '</AnimatePresence>'
# There are two AnimatePresence blocks here (one for desktop, one for mobile).
idx_first_ap = content.find(end_chunk2_str, start_chunk2) + len(end_chunk2_str)
idx_second_ap = content.find(end_chunk2_str, idx_first_ap) + len(end_chunk2_str)
end_chunk2 = idx_second_ap

if start_chunk2 != -1 and end_chunk2 != -1:
    # Just remove it completely, as it's now in BackgroundLayer
    content = content[:start_chunk2] + content[end_chunk2:]

# Handle imports
imports = "import { BackgroundLayer } from '../components/NewHome/sections/BackgroundLayer'\n"
if 'import { BackgroundLayer }' not in content:
    idx = content.find('\n', content.rfind("from '../components/NewHome/sections/RayDalioSection'")) + 1
    content = content[:idx] + imports + content[idx:]

# Also, since TEKS_4_SERVICES is defined inside Home.tsx or homeNewContent.ts, it's probably locally defined in Home.tsx. 
# Oh wait! TEKS_4_SERVICES is used! Let me check if it's imported or defined.
# If it's defined in Home.tsx, we pass it as prop, which we do.
# But wait, DimaDiamond3D import might be unused in Home.tsx now. Let's remove it if it is.
if '<DimaDiamond3D' not in content:
    content = re.sub(r"import\s*\{\s*DimaDiamond3D\s*\}\s*from\s*'../components/NewHome/DimaDiamond3D'\n?", "", content)

with open('src/pages/Home.tsx', 'w') as f:
    f.write(content)
