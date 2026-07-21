import os
from pathlib import Path
from PIL import Image

# ── KONFIGURASI ──────────────────────────────────────────────────────────

INPUT_ROOT = Path("public/illustration")
OUTPUT_ROOT = Path("public/illustration-compressed")

TIER_1_FOLDERS = {"home", "serviceHome", "nosotros", "models"}
TIER_2_FOLDERS = {"contact", "process", "products", "services"}

TIER_SETTINGS = {
    "tier1": {"max_dim": 2400, "quality": 75},
    "tier2": {"max_dim": 1400, "quality": 65},
}

VALID_EXTENSIONS = {".png", ".jpg", ".jpeg"}

# ── FUNGSI UTAMA ──────────────────────────────────────────────────────────

def get_tier_for_path(path: Path):
    if not path.parent or path.parent == INPUT_ROOT:
        return "tier1" # Root images are mostly full-screen hero backgrounds
        
    # Get top-level folder name inside illustration/
    rel_parts = path.relative_to(INPUT_ROOT).parts
    if len(rel_parts) > 1:
        folder_name = rel_parts[0]
        if folder_name in TIER_1_FOLDERS:
            return "tier1"
        elif folder_name in TIER_2_FOLDERS:
            return "tier2"
            
    return None

def resize_proportional(img: Image.Image, max_dim: int) -> Image.Image:
    width, height = img.size
    longest_side = max(width, height)
    if longest_side <= max_dim:
        return img
    scale_factor = max_dim / longest_side
    new_width = round(width * scale_factor)
    new_height = round(height * scale_factor)
    return img.resize((new_width, new_height), Image.LANCZOS)

def format_size(num_bytes: int) -> str:
    if num_bytes < 1024 * 1024:
        return f"{num_bytes / 1024:.1f} KB"
    return f"{num_bytes / (1024 * 1024):.2f} MB"

def process_image(input_path: Path, output_path: Path, max_dim: int, quality: int):
    with Image.open(input_path) as img:
        if img.mode not in ("RGB", "RGBA"):
            img = img.convert("RGBA" if "A" in img.mode else "RGB")
        resized = resize_proportional(img, max_dim)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        resized.save(output_path, "WEBP", quality=quality, method=6)

def main():
    if not INPUT_ROOT.exists():
        print(f"❌ Folder tidak ditemukan: {INPUT_ROOT.resolve()}")
        return

    total_original_size = 0
    total_compressed_size = 0
    processed_count = 0
    skipped_items = set()

    print(f"📂 Scanning: {INPUT_ROOT.resolve()}\n")

    for file_path in sorted(INPUT_ROOT.rglob("*")):
        if not file_path.is_file():
            continue
        if file_path.suffix.lower() not in VALID_EXTENSIONS:
            continue

        tier = get_tier_for_path(file_path)
        if tier is None:
            skipped_items.add(file_path.parent.name)
            continue

        settings = TIER_SETTINGS[tier]
        max_dim = settings["max_dim"]
        quality = settings["quality"]

        relative_path = file_path.relative_to(INPUT_ROOT)
        output_path = OUTPUT_ROOT / relative_path.with_suffix(".webp")

        original_size = file_path.stat().st_size

        try:
            process_image(file_path, output_path, max_dim, quality)
        except Exception as e:
            print(f"   ⚠️  Gagal proses {file_path.name}: {e}")
            continue

        compressed_size = output_path.stat().st_size
        reduction_pct = (1 - compressed_size / original_size) * 100

        total_original_size += original_size
        total_compressed_size += compressed_size
        processed_count += 1

        print(
            f"{file_path.name:35s} [{tier}] "
            f"{format_size(original_size):>10s} → {format_size(compressed_size):<10s} "
            f"(-{reduction_pct:.0f}%)"
        )

    print("=" * 60)
    print(f"✅ Selesai. {processed_count} gambar diproses.")
    if total_original_size > 0:
        total_reduction = (1 - total_compressed_size / total_original_size) * 100
        print(f"   Total sebelum : {format_size(total_original_size)}")
        print(f"   Total sesudah : {format_size(total_compressed_size)}")
        print(f"   Pengurangan   : {total_reduction:.1f}%")
    if skipped_items:
        print(f"\n⚠️  Folder di-skip (tidak masuk tier manapun): {', '.join(sorted(skipped_items))}")
    print(f"\n📂 Hasil tersimpan di: {OUTPUT_ROOT.resolve()}")

if __name__ == "__main__":
    main()
