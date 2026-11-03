$ffmpeg = ".\node_modules\@ffmpeg-installer\win32-x64\ffmpeg.exe"
$videoDir = "public\video\video-home\new-video"
$backupDir = Join-Path $videoDir "raw_backup"

if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir | Out-Null
}

$targets = @(
    @{ RawName = "13.mp4"; TargetName = "video13.mp4"; Slot = 13 },
    @{ RawName = "14.mp4"; TargetName = "video14.mp4"; Slot = 14 }
)

Write-Host "=== ENCODING NEW VIDEO 13 AND 14 TO ALL-INTRA (CRF 15) ==="

foreach ($t in $targets) {
    $rawFile = Join-Path $videoDir $t.RawName
    $targetFile = Join-Path $videoDir $t.TargetName
    $rawBackup = Join-Path $backupDir ("video" + $t.Slot + "_user_raw_new.mp4")
    $prevBackup = Join-Path $backupDir ("video" + $t.Slot + "_previous_encoded.mp4")
    $tempOutFile = Join-Path $videoDir ("video" + $t.Slot + "_intra_temp.mp4")

    if (-not (Test-Path $rawFile)) {
        Write-Error "Source file $($t.RawName) not found in $videoDir! Skipping..."
        continue
    }

    # Backup current existing video file if it exists
    if (Test-Path $targetFile) {
        Copy-Item $targetFile $prevBackup -Force
        Write-Host "Backed up previous $($t.TargetName) -> $prevBackup"
    }

    # Backup the user raw source file to raw_backup
    Copy-Item $rawFile $rawBackup -Force
    Write-Host "Backed up raw source $($t.RawName) -> $rawBackup"

    Write-Host "Encoding $($t.RawName) -> $($t.TargetName) (All-Intra CRF 15, faststart, no audio)..."
    $sw = [System.Diagnostics.Stopwatch]::StartNew()

    & $ffmpeg -i $rawFile -c:v libx264 -g 1 -keyint_min 1 -crf 15 -preset medium -pix_fmt yuv420p -an -movflags +faststart $tempOutFile -y

    $sw.Stop()

    if ((Test-Path $tempOutFile) -and ((Get-Item $tempOutFile).Length -gt 100000)) {
        Move-Item $tempOutFile $targetFile -Force
        $item = Get-Item $targetFile
        $outBytes = $item.Length
        $outMb = [math]::Round($outBytes / 1MB, 2)
        $sec = [math]::Round($sw.Elapsed.TotalSeconds, 1)
        Write-Host "[SUCCESS] $($t.TargetName) encoded: $outMb MB ($outBytes bytes) in $sec s"
    } else {
        Write-Error "[FAILED] Encoding $($t.TargetName)"
    }
}

Write-Host ""
Write-Host "=== ENCODING FINISHED - DETAILS ==="
foreach ($t in $targets) {
    $f = Join-Path $videoDir $t.TargetName
    if (Test-Path $f) {
        $item = Get-Item $f
        $len = $item.Length
        $mb = [math]::Round($len / 1MB, 2)
        Write-Host "$($t.TargetName): $len bytes ($mb MB)"
    }
}
