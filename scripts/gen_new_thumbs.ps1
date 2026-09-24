$ffmpeg = ".\node_modules\@ffmpeg-installer\win32-x64\ffmpeg.exe"
$files = @(
  "video1.mp4",
  "video2.mp4",
  "video5.mp4",
  "lanjutanvideo5(bukanpenggantivideo6).mp4",
  "video8.mp4",
  "lanjutanvideo8.mp4"
)

foreach ($f in $files) {
  $inputPath = Join-Path "public\video\video-home\intra" $f
  $nameOnly = [System.IO.Path]::GetFileNameWithoutExtension($f)
  $outputPath = Join-Path "public\video\video-home\thumbs" ($nameOnly + "_thumb.jpg")
  & $ffmpeg -ss 00:00:02 -i $inputPath -vframes 1 -q:v 2 $outputPath -y
  Write-Host "Generated thumbnail for $f -> $outputPath"
}
