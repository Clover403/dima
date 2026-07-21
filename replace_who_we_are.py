with open('src/pages/Home.tsx', 'r') as f:
    content = f.read()

import re

# We will find the comment {/* BEAT 1 DESKTOP */} and replace until the end of the BEAT 1 section.
pattern = r'(?s)(<motion\.div style={{ y: b1Y }} className="w-full relative max-w-\[750px\] xl:max-w-\[900px\] z-20 flex-shrink-0 hidden md:block">.*?{beats\[1\]\?\.ctaSecondary\?\.label}\n\s*</span>\n\s*</Link>\s*</div>\s*</div>)'

def replacer(match):
    return '''<WhoWeAreSection 
                                  beat={beats[1]} 
                                  b1Y={b1Y} 
                                  b1StrokeDashoffset={b1StrokeDashoffset} 
                                  b1StrokeOp={b1StrokeOp} 
                                  b1FillOp={b1FillOp} 
                                  heroFillOp={heroFillOp} 
                                />'''

new_content = re.sub(pattern, replacer, content, count=1)

# Add the import at the top
import_statement = "import { WhoWeAreSection } from '../components/NewHome/sections/WhoWeAreSection'\n"
if 'import { WhoWeAreSection }' not in new_content:
    imports_end = new_content.rfind("from '../constants/homeNewContent'")
    if imports_end != -1:
        insert_idx = new_content.find('\n', imports_end) + 1
        new_content = new_content[:insert_idx] + import_statement + new_content[insert_idx:]

with open('src/pages/Home.tsx', 'w') as f:
    f.write(new_content)
