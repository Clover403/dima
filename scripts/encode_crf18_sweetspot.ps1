$ffmpeg = ".\node_modules\@ffmpeg-installer\win32-x64\ffmpeg.exe"
$videoDir = "public\video\video-home\new-video"
$backupDir = Join-Path $videoDir "raw_backup"

$configs = @(
    @{ num = 4; src = (Join-Path $backupDir "video4_true_8s.mp4") },
    @{ num = 5; src = (Join-Path $backupDir "video5.mp4") },
    @{ num = 6; src = (Join-Path $backupDir "video6.mp4") },
    @{ num = 7; src = (Join-Path $backupDir "video7.mp4") }
)

Write-Host "=== ENCODING VIDEOS 4, 5, 6, 7 WITH CRF 18 (SWEET SPOT QUALITY) ==="

foreach ($cfg in $configs) {
    $num = $cfg.num
    $inPath = $cfg.src
    $origFile = Join-Path $videoDir "video$num.mp4"
    $tempOut = Join-Path $videoDir "video$($num)_crf18_temp.mp4"

    if (-not (Test-Path $inPath)) {
        Write-Warning "Source not found: $inPath"
        continue
    }

    $oldSize = if (Test-Path $origFile) { (Get-Item $origFile).Length } else { 0 }
    $oldMb = [math]::Round($oldSize / 1MB, 2)

    Write-Host "Encoding video$num.mp4 with CRF 18 from $inPath..."
    $sw = [System.Diagnostics.Stopwatch]::StartNew()

    & $ffmpeg -i $inPath -c:v libx264 -g 1 -keyint_min 1 -crf 18 -preset slow -pix_fmt yuv420p -an -movflags +faststart $tempOut -y 2>$null

    $sw.Stop()

    if ((Test-Path $tempOut) -and ((Get-Item $tempOut).Length -gt 100000)) {
        Move-Item $tempOut $origFile -Force
        $newSize = (Get-Item $origFile).Length
        $newMb = [math]::Round($newSize / 1MB, 2)
        $sec = [math]::Round($sw.Elapsed.TotalSeconds, 1)

        Write-Host "[SUCCESS] video$num.mp4 now: $newMb MB ($newSize bytes) in $sec s"
    } else {
        Write-Error "[FAILED] video$num.mp4 encode failed"
    }
}
