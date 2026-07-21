import re

with open('src/pages/Home.tsx', 'r') as f:
    content = f.read()

# Pattern to replace RAY DALIO blocks
# From {/* ── RAY DALIO DESKTOP ── */} to the end of {/* ── RAY DALIO MOBILE SIMPLIFIED ── */} block
# i.e., before <QuotePrinciplesScene ... />

start_str = '{/* ── RAY DALIO DESKTOP ── */}'
end_str = '<QuotePrinciplesScene scrollYProgress={scrollYProgress} />'

start_idx = content.find(start_str)
end_idx = content.find(end_str, start_idx)

if start_idx != -1 and end_idx != -1:
    replacement = '''<RayDalioSection
                dalioOp={dalioOp}
                dalioFilmY={dalioFilmY}
                dalioDraw={dalioDraw}
                dalioFillOp={dalioFillOp}
                bgX={bgX}
                bgY={bgY}
                fgX={fgX}
                fgY={fgY}
                borderColor={borderColor}
              />'''
    content = content[:start_idx] + '{/* ── RAY DALIO SECTION ── */}\n              ' + replacement + '\n              ' + content[end_idx:]

# Remove TEKS_RAY_DALIO and RAY_DALIO_ASSETS definitions
content = re.sub(r"const TEKS_RAY_DALIO = \{\s*eyebrow: 'LA TEORÍA FUNDAMENTAL',\s*description:.*?\n\}\n", "", content, flags=re.DOTALL)
content = re.sub(r"const RAY_DALIO_ASSETS = \[\s*\{ type: 'photo', src: '/foto/raydalio\.png' \},.*?\n\]\n", "", content, flags=re.DOTALL)

# Add imports for TEKS_RAY_DALIO and RayDalioSection
imports = "import { RayDalioSection } from '../components/NewHome/sections/RayDalioSection'\nimport { TEKS_RAY_DALIO } from '../constants/rayDalioContent'\n"
if 'import { RayDalioSection }' not in content:
    idx = content.find('\n', content.rfind("from '../components/NewHome/sections/ServicesSection'")) + 1
    if idx == 0: # just in case
        idx = content.find('\n', content.rfind("from '../components/NewHome/sections/ProductsSection'")) + 1
    content = content[:idx] + imports + content[idx:]

# Remove unused imports
if '<RayDalioFilmRoll' not in content:
    content = re.sub(r"import\s*\{\s*RayDalioFilmRoll\s*\}\s*from\s*'../components/NewHome/RayDalioFilmRoll'\n?", "", content)

if '<DalioEconomicChart' not in content:
    content = re.sub(r"import\s*\{\s*DalioEconomicChart\s*\}\s*from\s*'../components/NewHome/DalioEconomicChart'\n?", "", content)


with open('src/pages/Home.tsx', 'w') as f:
    f.write(content)
