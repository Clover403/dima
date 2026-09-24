$ffmpeg = ".\node_modules\@ffmpeg-installer\win32-x64\ffmpeg.exe"
$p = "public\video\video-home\intra\download.mp4"

if (Test-Path $p) {
  $size = (Get-Item $p).Length
  $mb = [math]::Round($size / 1MB, 2)
  Write-Host "File: $p ($mb MB, $size bytes)"
  $out = & $ffmpeg -i $p 2>&1
  $out | Select-String "Duration", "Stream #0:0" | ForEach-Object { Write-Host $_.Line }
} else {
  Write-Host "File NOT found: $p"
}
