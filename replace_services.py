import re

with open('src/pages/Home.tsx', 'r') as f:
    content = f.read()

# The pattern spans from ` {/* ── SERVICES DESKTOP ── */}` to just before ` {/* ── RAY DALIO DESKTOP ── */}`
# We will use regex to find this block and replace it.

pattern = r'(?s)(<div className="hidden lg:block">\s*<div className="absolute top-1/2 left-\[30vw\] lg:left-\[25vw\].*?</div>\s*</motion\.div>)'
replacement = '''<ServicesSection
                services={services}
                openIndex={openIndex}
                serviceOffsets={serviceOffsets}
                servicesOp={servicesOp}
                fgX={fgX}
                fgY={fgY}
                handlePointClick={handlePointClick}
                scrollYProgress={scrollYProgress}
              />'''

# Find the block carefully:
start_str = '{/* ── SERVICES DESKTOP ── */}'
end_str = '{/* ── RAY DALIO DESKTOP ── */}'

start_idx = content.find(start_str)
end_idx = content.find(end_str, start_idx)

if start_idx != -1 and end_idx != -1:
    # We replace from start_idx + len(start_str) + 1 up to end_idx
    # Let's just replace the whole thing including comments
    block_to_replace = content[start_idx:end_idx]
    content = content[:start_idx] + '{/* ── SERVICES SECTION ── */}\n              ' + replacement + '\n              ' + content[end_idx:]

# Add imports
imports = "import { ServicesSection } from '../components/NewHome/sections/ServicesSection'\n"
if 'import { ServicesSection }' not in content:
    idx = content.find('\n', content.rfind("from '../components/NewHome/sections/ProductsSection'")) + 1
    content = content[:idx] + imports + content[idx:]

# Clean up unused imports
for imp in ['GreekEngravingBackground', 'ServiceIconStructuration', 'ServiceIconRisk', 'ServiceIconSacredGeometry']:
    if f'<{imp}' not in content:
        # Removing from Home.tsx
        content = re.sub(rf"import\s*\{{\s*{imp}\s*\}}\s*from\s*'[^\n]+'\n?", "", content)
# Service icons are imported together, so if we remove one, we might leave empty curlies or something.
# The icons were imported as:
# import {
#   ServiceIconStructuration,
#   ServiceIconRisk,
#   ServiceIconSacredGeometry,
# } from '../constants/homeServiceIcons'

if '<ServiceIconStructuration' not in content:
    content = re.sub(r"import\s*\{\s*ServiceIconStructuration,\s*ServiceIconRisk,\s*ServiceIconSacredGeometry,\s*\}\s*from\s*'../constants/homeServiceIcons'\n?", "", content)
    # just in case it is one line
    content = re.sub(r"import\s*\{\s*ServiceIconStructuration,\s*ServiceIconRisk,\s*ServiceIconSacredGeometry\s*\}\s*from\s*'../constants/homeServiceIcons'\n?", "", content)

with open('src/pages/Home.tsx', 'w') as f:
    f.write(content)
