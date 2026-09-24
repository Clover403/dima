$ffmpeg = ".\node_modules\@ffmpeg-installer\win32-x64\ffmpeg.exe"
$intraDir = "public\video\video-home\intra"
$inputItem = Get-ChildItem -Path $intraDir -Filter "*20260920235403*" | Select-Object -First 1
if (!$inputItem) {
  Write-Host "ERROR: Hourglass file with timestamp 20260920235403 not found!"
  exit 1
}
$inputFile = $inputItem.FullName
$outputFile = Join-Path (Resolve-Path $intraDir) "home2_intra.mp4"
$thumbFile = "public\video\video-home\thumbs\home2_new_hourglass_thumb.jpg"

Write-Host "Input File: $inputFile"
$inputSize = (Get-Item $inputFile).Length
Write-Host "Original Size: $([math]::Round($inputSize / 1MB, 2)) MB ($inputSize bytes)"

# Encode to All-Intra CRF 15
Write-Host "Encoding to All-Intra CRF 15 -> $outputFile..."
$sw = [System.Diagnostics.Stopwatch]::StartNew()
& $ffmpeg -i $inputFile -c:v libx264 -g 1 -keyint_min 1 -crf 15 -preset medium -pix_fmt yuv420p -an -movflags +faststart $outputFile -y
$sw.Stop()

$outSize = (Get-Item $outputFile).Length
$sec = [math]::Round($sw.Elapsed.TotalSeconds, 1)
Write-Host "Encoding Done in ${sec}s! Output Size: $([math]::Round($outSize / 1MB, 2)) MB ($outSize bytes)"

# Inspect duration
$info = & $ffmpeg -i $outputFile 2>&1
$durMatch = [regex]::Match(($info -join "`n"), 'Duration:\s*(\d+):(\d+):(\d+\.\d+)')
$duration = 10.0
if ($durMatch.Success) {
  $duration = [double]$durMatch.Groups[1].Value * 3600 + [double]$durMatch.Groups[2].Value * 60 + [double]$durMatch.Groups[3].Value
}
Write-Host "Exact Duration: $duration seconds"

# Generate thumbnail
& $ffmpeg -ss 00:00:02 -i $outputFile -vframes 1 -q:v 2 $thumbFile -y
Write-Host "Generated thumbnail: $thumbFile"
