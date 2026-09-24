$ffmpeg = ".\node_modules\@ffmpeg-installer\win32-x64\ffmpeg.exe"
$intraDir = "public\video\video-home\intra"

$files = @(
  "video1.mp4",
  "video2.mp4",
  "video5.mp4",
  "lanjutanvideo5(bukanpenggantivideo6).mp4",
  "video8.mp4",
  "lanjutanvideo8.mp4"
)

foreach ($f in $files) {
  $p = Join-Path $intraDir $f
  if (Test-Path $p) {
    Write-Host "=========================================="
    Write-Host "FILE: $f"
    $sizeMb = [math]::Round((Get-Item $p).Length / 1MB, 2)
    Write-Host "SIZE: $sizeMb MB"
    $output = & $ffmpeg -i $p 2>&1
    $output | Select-String "Duration", "Stream #0:0" | ForEach-Object { Write-Host $_.Line }
  } else {
    Write-Host "NOT FOUND: $f"
  }
}
