$intraDir = "public\video\video-home\intra"
$bakDir = "public\video\video-home\intra\backup_original"

# 1. Ensure backup directory exists
if (!(Test-Path $bakDir)) {
  New-Item -ItemType Directory -Path $bakDir | Out-Null
  Write-Host "Created backup folder: $bakDir"
}

# 2. Backup existing home1 to home10
1..10 | ForEach-Object {
  $name = "home$($_)_intra.mp4"
  $srcFile = Join-Path $intraDir $name
  $dstFile = Join-Path $bakDir $name
  if ((Test-Path $srcFile) -and !(Test-Path $dstFile)) {
    Copy-Item $srcFile $dstFile -Force
    Write-Host "Backed up $name to backup_original/"
  }
}

# 3. Define the new canonical 1 to 12 sequence:
# 1: video1_intra.mp4 (Jam Pasir Baru)
# 2: backup_original/home2_intra.mp4 (Blueprint Arsitektur)
# 3: backup_original/home3_intra.mp4 (Agroindustria / Mesin Panen)
# 4: backup_original/home4_intra.mp4 (Konstruksi 1: Excavator Pondasi)
# 5: video5_intra.mp4 (Konstruksi 2: Rangka Luar Gedung Baru)
# 6: lanjutanvideo5_intra.mp4 (Konstruksi 3: Interior Rangka Baja)
# 7: backup_original/home6_intra.mp4 (Expansión: Gedung Selesai / Kota Pencakar Langit)
# 8: backup_original/home7_intra.mp4 (Energía: Turbin Angin & Solar)
# 9: video8_intra.mp4 (Logística 1: Pelabuhan & Loading Docks Baru)
# 10: backup_original/home9_intra.mp4 (Logística 2: Interior Gudang Warehouse)
# 11: backup_original/home10_intra.mp4 (Logística 3: Armada Truk Kontainer)
# 12: lanjutanvideo8_intra.mp4 (Logística 4: Lorong Rak Supermarket / Retail)

$sequence = @(
  @{ Target = "home1_intra.mp4"; Source = "video1_intra.mp4"; Fallback = "backup_original\home1_intra.mp4"; Label = "Hero: Hourglass Baru" },
  @{ Target = "home2_intra.mp4"; Source = "backup_original\home2_intra.mp4"; Fallback = $null; Label = "Hero: Blueprint Arsitektur" },
  @{ Target = "home3_intra.mp4"; Source = "backup_original\home3_intra.mp4"; Fallback = $null; Label = "Sektor 01: Agroindustria Mesin Panen" },
  @{ Target = "home4_intra.mp4"; Source = "backup_original\home4_intra.mp4"; Fallback = $null; Label = "Sektor 02: Konstruksi Pondasi (Excavator)" },
  @{ Target = "home5_intra.mp4"; Source = "video5_intra.mp4"; Fallback = "backup_original\home5_intra.mp4"; Label = "Sektor 02: Konstruksi Rangka Luar Baru" },
  @{ Target = "home6_intra.mp4"; Source = "lanjutanvideo5_intra.mp4"; Fallback = $null; Label = "Sektor 02: Konstruksi Rangka Dalam (Interior)" },
  @{ Target = "home7_intra.mp4"; Source = "backup_original\home6_intra.mp4"; Fallback = $null; Label = "Sektor 03: Expansión Kota Pencakar Langit" },
  @{ Target = "home8_intra.mp4"; Source = "backup_original\home7_intra.mp4"; Fallback = $null; Label = "Sektor 04: Energi Turbin & Solar" },
  @{ Target = "home9_intra.mp4"; Source = "video8_intra.mp4"; Fallback = "backup_original\home8_intra.mp4"; Label = "Sektor 05: Logistik Pelabuhan Docks" },
  @{ Target = "home10_intra.mp4"; Source = "backup_original\home9_intra.mp4"; Fallback = $null; Label = "Sektor 05: Logistik Interior Gudang" },
  @{ Target = "home11_intra.mp4"; Source = "backup_original\home10_intra.mp4"; Fallback = $null; Label = "Sektor 05: Logistik Armada Truk Kontainer" },
  @{ Target = "home12_intra.mp4"; Source = "lanjutanvideo8_intra.mp4"; Fallback = $null; Label = "Sektor 05: Logistik Rak Supermarket" }
)

Write-Host "--- Copying / Arranging Videos into Canonical home1..home12 ---"

foreach ($item in $sequence) {
  $targetPath = Join-Path $intraDir $item.Target
  $sourcePath = Join-Path $intraDir $item.Source

  if (!(Test-Path $sourcePath) -and $item.Fallback) {
    $sourcePath = Join-Path $intraDir $item.Fallback
  }

  if (Test-Path $sourcePath) {
    Copy-Item $sourcePath $targetPath -Force
    $sizeMb = [math]::Round((Get-Item $targetPath).Length / 1MB, 2)
    $targetName = $item.Target
    $sourceName = $item.Source
    $label = $item.Label
    Write-Host "OK: $targetName ($sizeMb MB) <- $sourceName [$label]"
  } else {
    Write-Host "MISSING: $($item.Source) for $($item.Target)"
  }
}

Write-Host "--- Sequence Arranged Successfully! ---"
