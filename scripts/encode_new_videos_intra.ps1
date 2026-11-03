$ffmpeg = ".\node_modules\@ffmpeg-installer\win32-x64\ffmpeg.exe"
$videoDir = "public\video\video-home\new-video"
$backupDir = Join-Path $videoDir "raw_backup"

if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir | Out-Null
}

$videosToEncode = @(1, 2, 3, 4, 5, 6, 9, 10, 11, 12)

Write-Host "=== STARTING ALL-INTRA ENCODING FOR NEW VIDEOS ==="

foreach ($num in $videosToEncode) {
    $origFile = Join-Path $videoDir "video$num.mp4"
    $backupFile = Join-Path $backupDir "video$num.mp4"
    $tempOutFile = Join-Path $videoDir "video$($num)_intra_temp.mp4"

    if ((-not (Test-Path $origFile)) -and (-not (Test-Path $backupFile))) {
        Write-Warning "video$num.mp4 not found! Skipping..."
        continue
    }

    if (-not (Test-Path $backupFile)) {
        Copy-Item $origFile $backupFile -Force
        Write-Host "Backed up original video$num.mp4 -> raw_backup"
    }

    $inPath = $backupFile
    Write-Host "Encoding video$num.mp4 (All-Intra, CRF 15, faststart)..."
    $sw = [System.Diagnostics.Stopwatch]::StartNew()

    & $ffmpeg -i $inPath -c:v libx264 -g 1 -keyint_min 1 -crf 15 -preset medium -pix_fmt yuv420p -an -movflags +faststart $tempOutFile -y

    $sw.Stop()

    if ((Test-Path $tempOutFile) -and ((Get-Item $tempOutFile).Length -gt 100000)) {
        Move-Item $tempOutFile $origFile -Force
        $item = Get-Item $origFile
        $outBytes = $item.Length
        $outMb = [math]::Round($outBytes / 1MB, 2)
        $sec = [math]::Round($sw.Elapsed.TotalSeconds, 1)
        Write-Host "[SUCCESS] video$num.mp4 encoded: $outMb MB ($outBytes bytes) in $sec s"
    } else {
        Write-Error "[FAILED] video$num.mp4"
    }
}

Write-Host ""
Write-Host "=== FINAL SIZES OF ALL 16 VIDEOS ==="
for ($i = 1; $i -le 16; $i++) {
    $f = Join-Path $videoDir "video$i.mp4"
    if (Test-Path $f) {
        $item = Get-Item $f
        $len = $item.Length
        $mb = [math]::Round($len / 1MB, 2)
        Write-Host "video$i.mp4: $len bytes ($mb MB)"
    } else {
        Write-Host "video$i.mp4: MISSING"
    }
}
