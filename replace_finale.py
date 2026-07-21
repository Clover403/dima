with open('src/pages/Home.tsx', 'r') as f:
    content = f.read()

import re

# We will find the comment {/* ── FINALE ── */} and replace the div block.
pattern = r'(?s)(<div className="flex flex-col items-center justify-end w-full h-full pb-\[10vh\] pt-\[12vh\] text-center relative px-4">.*?Conoce Dima\s*</motion\.div>\s*</Link>\s*</div>\s*</div>\s*</div>)'

def replacer(match):
    return '<FinaleSection borderColor={borderColor} textColor={textColor} />'

new_content = re.sub(pattern, replacer, content, count=1)

# Add the import at the top
import_statement = "import { FinaleSection } from '../components/NewHome/sections/FinaleSection'\n"
if 'import { FinaleSection }' not in new_content:
    # insert after the last import
    imports_end = new_content.rfind("from '../constants/homeNewContent'")
    if imports_end != -1:
        insert_idx = new_content.find('\n', imports_end) + 1
        new_content = new_content[:insert_idx] + import_statement + new_content[insert_idx:]

with open('src/pages/Home.tsx', 'w') as f:
    f.write(new_content)
