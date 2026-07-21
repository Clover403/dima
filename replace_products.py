import re

with open('src/pages/Home.tsx', 'r') as f:
    content = f.read()

# Pattern 1: PRODUCTS SEQUENCE & MOBILE SIMPLIFIED
pattern1 = r'(?s)(<div className="absolute inset-0 pointer-events-none z-30 hidden md:block">\s*\{products\.map\(\(product, idx\) => \(\s*<ProductSequenceItem.*?</div>\s*</motion\.div>)'

def replacer1(match):
    return '''<ProductsSequenceLayer 
                products={products}
                scrollYProgress={scrollYProgress}
                title3Opacity={title3Opacity}
              />'''

content = re.sub(pattern1, replacer1, content, count=1)

# Pattern 2: BEAT 2 DESKTOP & MOBILE
pattern2 = r'(?s)(<motion\.div style={{ y: b2Y }} className="w-full relative mt-0 mb-0 -ml-1 hidden md:block">.*?{beats\[2\]\?\.ctaSecondary\?\.label}\n\s*</span>\n\s*</Link>\s*</div>\s*</div>)'

def replacer2(match):
    return '''<ProductsForeground 
                                  beat={beats[2]}
                                  b2Y={b2Y}
                                  b2PathLength={b2PathLength}
                                  b2StrokeOp={b2StrokeOp}
                                  b2FillOp={b2FillOp}
                                  heroFillOp={heroFillOp}
                                  b2StrokeDashoffset={b2StrokeDashoffset}
                                />'''

content = re.sub(pattern2, replacer2, content, count=1)

# Add the imports at the top
imports = "import { ProductsSequenceLayer, ProductsForeground } from '../components/NewHome/sections/ProductsSection'\n"
if 'ProductsSequenceLayer' not in content:
    imports_end = content.rfind("from '../components/NewHome/sections/WhoWeAreSection'")
    if imports_end != -1:
        insert_idx = content.find('\n', imports_end) + 1
        content = content[:insert_idx] + imports + content[insert_idx:]
    else:
        # fallback
        imports_end = content.rfind("from '../constants/homeNewContent'")
        insert_idx = content.find('\n', imports_end) + 1
        content = content[:insert_idx] + imports + content[insert_idx:]

# We also need to remove imports that are now exclusively used in ProductsSection, but for safety it's fine if they remain.
# Actually let's remove ProductSequenceItem from Home.tsx if it's unused.
if '<ProductSequenceItem' not in content:
    content = re.sub(r"import\s*\{\s*ProductSequenceItem\s*\}\s*from\s*'../components/NewHome/ProductSequenceItem'\n?", "", content)
    
if '<EngravingDalioEquilibriumChart' not in content:
    content = re.sub(r"import\s*\{\s*EngravingDalioEquilibriumChart\s*\}\s*from\s*'../constants/EngravingDalioEquilibriumChart'\n?", "", content)

with open('src/pages/Home.tsx', 'w') as f:
    f.write(content)
