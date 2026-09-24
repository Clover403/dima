$intraDir = "public\video\video-home\intra"
$ffmpeg = ".\node_modules\@ffmpeg-installer\win32-x64\ffmpeg.exe"

$video2Intra = Join-Path $intraDir "video2_intra.mp4"
if (!(Test-Path $video2Intra)) {
  Write-Host "ERROR: video2_intra.mp4 not found!"
  exit 1
}

Write-Host "--- Shifting home3..home12 up by 1 to make room for new home3 ---"

# Shift from 12 down to 3
for ($i = 12; $i -ge 3; $i--) {
  $oldName = "home$($i)_intra.mp4"
  $newName = "home$($i + 1)_intra.mp4"
  $oldPath = Join-Path $intraDir $oldName
  $newPath = Join-Path $intraDir $newName

  if (Test-Path $oldPath) {
    Copy-Item $oldPath $newPath -Force
    Write-Host "Shifted: $oldName -> $newName ($([math]::Round((Get-Item $newPath).Length / 1MB, 2)) MB)"
  }
}

# Copy video2_intra.mp4 to home3_intra.mp4
$newHome3 = Join-Path $intraDir "home3_intra.mp4"
Copy-Item $video2Intra $newHome3 -Force
Write-Host "Set new home3_intra.mp4 from video2_intra.mp4 ($([math]::Round((Get-Item $newHome3).Length / 1MB, 2)) MB)"

Write-Host "`n--- Collecting Stats for All 13 Videos ---"
$sizes = @()
$durations = @()

1..13 | ForEach-Object {
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
