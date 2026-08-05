import os
import sys
from PIL import Image

src_dir = 'public/sequancesdima2'
dest_dir = 'public/sequancesdima2_webp'
quality = 90  # Not too aggressive, 90 is very high quality for WebP

if not os.path.exists(dest_dir):
    os.makedirs(dest_dir)

count = 0
for root, dirs, files in os.walk(src_dir):
    rel_path = os.path.relpath(root, src_dir)
    dest_path = os.path.join(dest_dir, rel_path)
    if not os.path.exists(dest_path):
        os.makedirs(dest_path)
        
    for f in sorted(files):
        if f.lower().endswith(('.png', '.jpg', '.jpeg')):
            src_file = os.path.join(root, f)
            dest_file = os.path.join(dest_path, os.path.splitext(f)[0] + '.webp')
            if not os.path.exists(dest_file):
                try:
                    with Image.open(src_file) as img:
                        img.save(dest_file, 'webp', quality=quality)
                        count += 1
                        if count % 50 == 0:
                            print(f'Converted {count} images...')
                except Exception as e:
                    print(f'Error converting {src_file}: {e}')

print(f'Finished! Total converted: {count}')
