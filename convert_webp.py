import os
from PIL import Image
from pathlib import Path

def convert_png_to_webp(directory):
    path = Path(directory)
    # Find all PNGs in the directory and subdirectories
    for png_path in path.rglob("*.png"):
        # Define output path with .webp extension
        webp_path = png_path.with_suffix(".webp")
        
        try:
            # Open and convert
            with Image.open(png_path) as img:
                # Save as WebP with optimized settings
                img.save(webp_path, "WEBP", quality=80, method=6)
            print(f"Converted: {png_path.name} -> {webp_path.name}")
            
            # Optionally, delete the original PNG
            os.remove(png_path)
            print(f"Deleted original: {png_path.name}")
        except Exception as e:
            print(f"Failed to convert {png_path}: {e}")

if __name__ == "__main__":
    target_dir = "/home/trav-clover/Documents/AAA projects/dima/dima-web/public/sequancesdima"
    print(f"Starting conversion in {target_dir}...")
    convert_png_to_webp(target_dir)
    print("Done!")
