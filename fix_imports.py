with open('src/pages/Home.tsx', 'r') as f:
    content = f.read()

import_statement = "import { ProductsSequenceLayer, ProductsForeground } from '../components/NewHome/sections/ProductsSection'\n"

if 'import { ProductsSequenceLayer' not in content:
    idx = content.find('\n', content.rfind("from '../constants/homeNewContent'")) + 1
    content = content[:idx] + import_statement + content[idx:]

# Also remove IconMacroSystem if unused
if '<IconMacroSystem' not in content:
    import re
    content = re.sub(r"import\s*\{\s*IconMacroSystem\s*\}\s*from\s*'../constants/homeProductPointIcons'\n?", "", content)

with open('src/pages/Home.tsx', 'w') as f:
    f.write(content)
