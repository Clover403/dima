import os
import re

def update_file(filepath, imports_block, replacements):
    try:
        with open(filepath, 'r') as f:
            content = f.read()

        # check if already imported
        if "HoverTrailOverlay" not in content:
            # find first import
            import_idx = content.find("import ")
            if import_idx != -1:
                content = content[:import_idx] + imports_block + "\n" + content[import_idx:]
            else:
                content = imports_block + "\n" + content

        for old, new in replacements:
            if old in content:
                content = content.replace(old, new)
            else:
                print(f"Pattern not found in {filepath}: {old[:30]}...")

        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Updated {filepath}")
    except Exception as e:
        print(f"Failed {filepath}: {e}")

# 1. ProductoDetalle.tsx
update_file(
    "src/pages/ProductoDetalle.tsx",
    "import HoverTrailOverlay from '../components/HoverTrailOverlay';",
    [
        (
            '<div className="relative w-full aspect-[4/3] lg:aspect-square overflow-hidden rounded-2xl md:rounded-3xl border border-[#F4F4F5]/10 bg-[#F4F4F5]/5 shadow-2xl">',
            '<div className="relative w-full aspect-[4/3] lg:aspect-square overflow-hidden rounded-2xl md:rounded-3xl border border-[#F4F4F5]/10 bg-[#F4F4F5]/5 shadow-2xl cursor-none">'
        ),
        (
            '</AnimatePresence>\n            </div>',
            '</AnimatePresence>\n              <HoverTrailOverlay theme="lightgray" className="absolute inset-0 z-20 w-full h-full" />\n            </div>'
        )
    ]
)

# 2. ServicioDetalle.tsx
update_file(
    "src/pages/ServicioDetalle.tsx",
    "import HoverTrailOverlay from '../components/HoverTrailOverlay';",
    [
        (
            '<div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square overflow-hidden rounded-2xl border border-[#F4F4F5]/10 shadow-2xl">',
            '<div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square overflow-hidden rounded-2xl border border-[#F4F4F5]/10 shadow-2xl cursor-none">'
        ),
        (
            'className="absolute inset-0 w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-700 ease-out"\n                    />\n                  </div>',
            'className="absolute inset-0 w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-700 ease-out"\n                    />\n                    <HoverTrailOverlay theme="lightgray" className="absolute inset-0 z-20 w-full h-full" />\n                  </div>'
        )
    ]
)

# 3. ServicesShowcase.tsx
update_file(
    "src/components/servicios/ServicesShowcase.tsx",
    "import HoverTrailOverlay from '../HoverTrailOverlay';",
    [
        (
            '<div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square overflow-hidden rounded-2xl border border-[#F4F4F5]/10 shadow-2xl">',
            '<div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square overflow-hidden rounded-2xl border border-[#F4F4F5]/10 shadow-2xl cursor-none">'
        ),
        (
            'className="absolute inset-0 w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-700 ease-out"\n                        />\n                      </div>',
            'className="absolute inset-0 w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-700 ease-out"\n                        />\n                        <HoverTrailOverlay theme="lightgray" className="absolute inset-0 z-20 w-full h-full" />\n                      </div>'
        )
    ]
)

