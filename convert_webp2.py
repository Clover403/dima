import sys
import os
from PIL import Image
from pathlib import Path

def convert_png_to_webp(directory):
    path = Path(directory)
    for png_path in path.rglob("*.png"):
        webp_path = png_path.with_suffix(".webp")
        try:
            with Image.open(png_path) as img:
                img.save(webp_path, "WEBP", quality=80, method=6)
            print(f"Converted: {png_path.name} -> {webp_path.name}")
            os.remove(png_path)
        except Exception as e:
            print(f"Failed to convert {png_path}: {e}")

if __name__ == "__main__":
    for target_dir in sys.argv[1:]:
        print(f"Starting conversion in {target_dir}...")
        convert_png_to_webp(target_dir)
    print("Done!")
