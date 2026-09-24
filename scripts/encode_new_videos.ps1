$ffmpeg = ".\node_modules\@ffmpeg-installer\win32-x64\ffmpeg.exe"
$intraDir = "public\video\video-home\intra"

$encodeList = @(
  @{ In = "video1.mp4"; Out = "video1_intra.mp4" },
  @{ In = "video2.mp4"; Out = "video2_intra.mp4" },
  @{ In = "video5.mp4"; Out = "video5_intra.mp4" },
  @{ In = "lanjutanvideo5(bukanpenggantivideo6).mp4"; Out = "lanjutanvideo5_intra.mp4" },
  @{ In = "video8.mp4"; Out = "video8_intra.mp4" },
  @{ In = "lanjutanvideo8.mp4"; Out = "lanjutanvideo8_intra.mp4" }
)

Write-Host "--- Encoding New Videos to Crisp All-Intra Format (CRF 15) ---"

foreach ($item in $encodeList) {
  $inPath = Join-Path $intraDir $item.In
  $outPath = Join-Path $intraDir $item.Out

  if (!(Test-Path $inPath)) {
    Write-Host "SKIP: $($item.In) not found."
    continue
  }

  Write-Host "Encoding $($item.In) -> $($item.Out)..."
  $sw = [System.Diagnostics.Stopwatch]::StartNew()
  & $ffmpeg -i $inPath -c:v libx264 -g 1 -keyint_min 1 -crf 15 -preset medium -pix_fmt yuv420p -an -movflags +faststart $outPath -y 2>$null
  $sw.Stop()

  if (Test-Path $outPath) {
    $inMb = [math]::Round((Get-Item $inPath).Length / 1MB, 2)
    $outBytes = (Get-Item $outPath).Length
    $outMb = [math]::Round($outBytes / 1MB, 2)
    $sec = [math]::Round($sw.Elapsed.TotalSeconds, 1)
    Write-Host "SUCCESS: $($item.Out) ($outMb MB, $outBytes bytes) encoded in ${sec}s (from $inMb MB)"
  } else {
    Write-Host "FAILED: $($item.Out)"
  }
}

Write-Host "--- All New Videos Encoded! ---"
