import os
import re
from pathlib import Path

def fix_paths():
    src_dir = Path('src')
    
    fixes = {
        "/illustration-compressed/temple6.webp": "/illustration-compressed/home/temple6.webp",
        "/illustration-compressed/temple9.webp": "/illustration-compressed/home/temple9.webp",
        "/illustration-compressed/jembatan3.webp": "/illustration-compressed/home/jembatan3.webp",
        "/illustration-compressed/timbangan1.webp": "/illustration-compressed/home/timbangan1.webp",
        "/illustration-compressed/3rodaekonomi.webp": "/illustration-compressed/home/3rodaekonomi.webp"
    }
    
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith('.ts') or file.endswith('.tsx'):
                filepath = Path(root) / file
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                new_content = content
                for old, new in fixes.items():
                    new_content = new_content.replace(old, new)
                
                if new_content != content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Fixed {filepath}")

if __name__ == '__main__':
    fix_paths()
