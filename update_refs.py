import os
import re
from pathlib import Path

def main():
    src_dir = Path('src')
    count = 0
    
    # Regex to match /illustration/... up to .png, .jpg, .jpeg
    pattern = re.compile(r'/illustration/(.*?)\.(png|jpg|jpeg)', re.IGNORECASE)
    
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith('.ts') or file.endswith('.tsx'):
                filepath = Path(root) / file
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                new_content, num_subs = pattern.subn(r'/illustration-compressed/\1.webp', content)
                
                if num_subs > 0:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Updated {filepath} ({num_subs} replacements)")
                    count += 1
                    
    print(f"Done. Updated {count} files.")

if __name__ == '__main__':
    main()
