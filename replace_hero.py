with open('src/pages/Home.tsx', 'r') as f:
    content = f.read()

import re

# We will find the comment {/* HERO DESKTOP */} and replace until the end of the HERO section.
pattern = r'(?s)(<motion\.div style={{ y: b0Y }} className="w-full relative mt-2 mb-4 -ml-1 hidden md:block">.*?{beats\[0\]\?\.ctaSecondary\?\.label}\n\s*</span>\n\s*</Link>\s*</div>\s*</div>)'

def replacer(match):
    return '''<HeroSection 
                                  beat={beats[0]} 
                                  b0Y={b0Y} 
                                  heroStrokeDashoffset={heroStrokeDashoffset} 
                                  heroStrokeOp={heroStrokeOp} 
                                  heroFillOp={heroFillOp} 
                                />'''

new_content = re.sub(pattern, replacer, content, count=1)

# Add the import at the top
import_statement = "import { HeroSection } from '../components/NewHome/sections/HeroSection'\n"
if 'import { HeroSection }' not in new_content:
    imports_end = new_content.rfind("from '../constants/homeNewContent'")
    if imports_end != -1:
        insert_idx = new_content.find('\n', imports_end) + 1
        new_content = new_content[:insert_idx] + import_statement + new_content[insert_idx:]

with open('src/pages/Home.tsx', 'w') as f:
    f.write(new_content)
