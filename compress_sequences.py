import sys
import os
from PIL import Image
from pathlib import Path

def compress_and_resize(directory):
    path = Path(directory)
    total_files = 0
    total_saved = 0
    
    for webp_path in path.rglob("*.webp"):
        total_files += 1
        try:
            original_size = os.path.getsize(webp_path)
            with Image.open(webp_path) as img:
                # Resize if it's 1080p
                if img.width > 1280:
                    new_height = int((1280 / img.width) * img.height)
                    img = img.resize((1280, new_height), Image.Resampling.LANCZOS)
                
                # Overwrite the file with lower quality
                img.save(webp_path, "WEBP", quality=50, method=6)
                
            new_size = os.path.getsize(webp_path)
            total_saved += (original_size - new_size)
            print(f"Compressed {webp_path.name}: {original_size/1024:.1f}KB -> {new_size/1024:.1f}KB")
        except Exception as e:
            print(f"Failed to process {webp_path}: {e}")

    print(f"\nDone! Processed {total_files} files.")
    print(f"Total space saved: {total_saved / (1024*1024):.2f} MB")

if __name__ == "__main__":
    for target_dir in sys.argv[1:]:
        print(f"Starting compression in {target_dir}...")
        compress_and_resize(target_dir)
