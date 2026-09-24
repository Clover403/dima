$intraDir = "public\video\video-home\intra"
$ffmpeg = ".\node_modules\@ffmpeg-installer\win32-x64\ffmpeg.exe"

$sizes = @()
$durations = @()

1..12 | ForEach-Object {
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
  $durations += [math]::Round($sec, 1)
}

Write-Host "KNOWN_VIDEO_SIZES: [" ($sizes -join ", ") "]"
Write-Host "KNOWN_DURATIONS: [" ($durations -join ", ") "]"
