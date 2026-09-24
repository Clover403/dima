$intraDir = "public\video\video-home\intra"
$ffmpeg = ".\node_modules\@ffmpeg-installer\win32-x64\ffmpeg.exe"

$downloadMp4 = Join-Path $intraDir "download.mp4"
if (!(Test-Path $downloadMp4)) {
  Write-Host "ERROR: download.mp4 not found!"
  exit 1
}

Write-Host "--- Encoding download.mp4 to home1_intra.mp4 (All-Intra CRF 15) ---"
$stagedHome1 = Join-Path $intraDir "staged_home1_intra.mp4"
& $ffmpeg -i $downloadMp4 -vf "scale=1280:720:flags=lanczos" -c:v libx264 -g 1 -keyint_min 1 -crf 15 -preset medium -pix_fmt yuv420p -an -movflags +faststart $stagedHome1 -y 2>$null

Write-Host "--- Shifting home3..home13 down by 1 to become home2..home12 ---"

# Staging directory for clean shift
$staging = Join-Path $intraDir "staging_12"
if (!(Test-Path $staging)) { New-Item -ItemType Directory -Path $staging | Out-Null }

# Move staged home1 into staging
Move-Item $stagedHome1 (Join-Path $staging "home1_intra.mp4") -Force

# Shift home3..home13 to home2..home12 in staging
for ($i = 3; $i -le 13; $i++) {
  $targetNum = $i - 1
  $srcFile = Join-Path $intraDir "home$($i)_intra.mp4"
  $dstFile = Join-Path $staging "home$($targetNum)_intra.mp4"
  if (Test-Path $srcFile) {
    Copy-Item $srcFile $dstFile -Force
    Write-Host "Staged: home$($targetNum)_intra.mp4 <- home$($i)_intra.mp4"
  }
}

# Copy all 12 from staging back to intraDir
for ($i = 1; $i -le 12; $i++) {
  $staged = Join-Path $staging "home$($i)_intra.mp4"
  $final = Join-Path $intraDir "home$($i)_intra.mp4"
  Copy-Item $staged $final -Force
}

# Remove old home13_intra.mp4 if still exists
$oldHome13 = Join-Path $intraDir "home13_intra.mp4"
if (Test-Path $oldHome13) {
  Remove-Item $oldHome13 -Force
  Write-Host "Cleaned up old home13_intra.mp4"
}

Remove-Item $staging -Recurse -Force

Write-Host "`n--- Collecting Stats for All 12 Videos ---"
$sizes = @()
$durations = @()

1..12 | ForEach-Object {
  $f = "home$($_)_intra.mp4"
  $p = Join-Path $intraDir $f
  if (Test-Path $p) {
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
  } else {
    Write-Host "MISSING: $f"
  }
}

Write-Host "`nKNOWN_VIDEO_SIZES: [" ($sizes -join ", ") "]"
Write-Host "KNOWN_DURATIONS: [" ($durations -join ", ") "]"
