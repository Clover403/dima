$intraDir = "public\video\video-home\intra"
$ffmpeg = ".\node_modules\@ffmpeg-installer\win32-x64\ffmpeg.exe"

$canonicalMap = @(
  @{ Target = "home1_intra.mp4";  Source = "video1_intra.mp4";                    Label = "Hero 1: Hourglass 1" },
  @{ Target = "home2_intra.mp4";  Source = "home2_intra.mp4";                     Label = "Hero 2: Hourglass Currency Draining" },
  @{ Target = "home3_intra.mp4";  Source = "video2_intra.mp4";                    Label = "Sektor 01: Agro Bulir Gandum (video2)" },
  @{ Target = "home4_intra.mp4";  Source = "backup_original\home3_intra.mp4";     Label = "Sektor 01: Agro Traktor Panen" },
  @{ Target = "home5_intra.mp4";  Source = "backup_original\home4_intra.mp4";     Label = "Sektor 02: Konstruksi Excavator Pondasi" },
  @{ Target = "home6_intra.mp4";  Source = "video5_intra.mp4";                    Label = "Sektor 02: Konstruksi Rangka Luar Baru" },
  @{ Target = "home7_intra.mp4";  Source = "lanjutanvideo5_intra.mp4";            Label = "Sektor 02: Konstruksi Rangka Dalam Interior" },
  @{ Target = "home8_intra.mp4";  Source = "backup_original\home6_intra.mp4";     Label = "Sektor 03: Expansión Kota Pencakar Langit" },
  @{ Target = "home9_intra.mp4";  Source = "backup_original\home7_intra.mp4";     Label = "Sektor 04: Energi Turbin & Solar" },
  @{ Target = "home10_intra.mp4"; Source = "video8_intra.mp4";                    Label = "Sektor 05: Logistik Pelabuhan Docks" },
  @{ Target = "home11_intra.mp4"; Source = "backup_original\home9_intra.mp4";     Label = "Sektor 05: Logistik Interior Gudang" },
  @{ Target = "home12_intra.mp4"; Source = "backup_original\home10_intra.mp4";    Label = "Sektor 05: Logistik Armada Truk Kontainer" },
  @{ Target = "home13_intra.mp4"; Source = "lanjutanvideo8_intra.mp4";            Label = "Sektor 05: Logistik Rak Supermarket Retail" }
)

Write-Host "--- Copying from Clean Canonical Sources to home1..home13 ---"

# Use a temporary staging directory to avoid any source-target clash
$stagingDir = Join-Path $intraDir "staging_13"
if (!(Test-Path $stagingDir)) { New-Item -ItemType Directory -Path $stagingDir | Out-Null }

foreach ($item in $canonicalMap) {
  $src = Join-Path $intraDir $item.Source
  $staged = Join-Path $stagingDir $item.Target
  if (Test-Path $src) {
    Copy-Item $src $staged -Force
    $mb = [math]::Round((Get-Item $staged).Length / 1MB, 2)
    Write-Host "Staged: $($item.Target) ($mb MB) <- $($item.Source) [$($item.Label)]"
  } else {
    Write-Host "ERROR: Missing source $src"
    exit 1
  }
}

# Move from staging to intraDir
foreach ($item in $canonicalMap) {
  $staged = Join-Path $stagingDir $item.Target
  $final = Join-Path $intraDir $item.Target
  Copy-Item $staged $final -Force
}
Remove-Item $stagingDir -Recurse -Force

Write-Host "`n--- Collecting Stats for All 13 Videos ---"
$sizes = @()
$durations = @()

1..13 | ForEach-Object {
  $f = "home$($_)_intra.mp4"
  $p = Join-Path $intraDir $f
  $len = (Get-Item $p).Length
  $sizes += $len

  $out = & $ffmpeg -i $p 2>&1
  $durMatch = [regex]::Match(($out -join "`n"), 'Duration:\s*(\d+):(\d+):(\d+\.\d+)')
  $sec = 10.0
  if ($durMatch.Success) {
    $sec = [double]$durMatch.Groups[1].Value * 3600 + [double]$durMatch.Groups[2].Value * 60 + [double]$durMatch.Groups[3].Value
  }
  $roundSec = [math]::Round($sec, 1)
  $durations += $roundSec
  Write-Host "$f : $([math]::Round($len / 1MB, 2)) MB ($len bytes), $roundSec seconds"
}

Write-Host "`nKNOWN_VIDEO_SIZES: [" ($sizes -join ", ") "]"
Write-Host "KNOWN_DURATIONS: [" ($durations -join ", ") "]"
