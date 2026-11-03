$ffmpeg = ".\node_modules\@ffmpeg-installer\win32-x64\ffmpeg.exe"
$videoDir = "public\video\video-home\new-video"
$backupDir = Join-Path $videoDir "raw_backup"

if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir | Out-Null
}

$targets = @(12, 13)

Write-Host "=== ENCODING VIDEO 12 AND 13 TO ALL-INTRA ==="

foreach ($num in $targets) {
    $origFile = Join-Path $videoDir "video$num.mp4"
    $backupFile = Join-Path $backupDir "video$($num)_raw_latest.mp4"
    $tempOutFile = Join-Path $videoDir "video$($num)_intra_temp.mp4"

    if (-not (Test-Path $origFile)) {
        Write-Warning "video$num.mp4 not found! Skipping..."
        continue
    }

    # Backup current raw file
    Copy-Item $origFile $backupFile -Force
    Write-Host "Backed up original video$num.mp4 -> $backupFile"

    Write-Host "Encoding video$num.mp4 (All-Intra CRF 15)..."
    $sw = [System.Diagnostics.Stopwatch]::StartNew()

    & $ffmpeg -i $backupFile -c:v libx264 -g 1 -keyint_min 1 -crf 15 -preset medium -pix_fmt yuv420p -an -movflags +faststart $tempOutFile -y

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
Write-Host "=== SIZES FOR VIDEO 12 AND 13 ==="
foreach ($num in $targets) {
    $f = Join-Path $videoDir "video$num.mp4"
    $item = Get-Item $f
    $len = $item.Length
    $mb = [math]::Round($len / 1MB, 2)
    Write-Host "video$num.mp4: $len bytes ($mb MB)"
}
