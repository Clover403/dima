$ffmpeg = ".\node_modules\@ffmpeg-installer\win32-x64\ffmpeg.exe"
$distDir = "dist\video\video-home\new-video"
$publicDir = "public\video\video-home\new-video"
$masterBackupDir = "public\video\video-home\new-video\raw_backup\crf15_masters"

if (-not (Test-Path $masterBackupDir)) {
    New-Item -ItemType Directory -Path $masterBackupDir -Force | Out-Null
}

$videos = 2..14

Write-Host "=== 1. BACKING UP PRISTINE CRF 15 MASTERS ==="
foreach ($n in $videos) {
    $src = Join-Path $distDir "video$n.mp4"
    $dst = Join-Path $masterBackupDir "video$n.mp4"
    if (Test-Path $src) {
        if (-not (Test-Path $dst)) {
            Copy-Item $src $dst -Force
            Write-Host "Backed up video$n.mp4 to crf15_masters"
        }
    } else {
        Write-Warning "Source not found in dist for video$($n): $src"
    }
}

Write-Host ""
Write-Host "=== 2. STARTING BATCH ALL-INTRA ENCODING AT CRF 17 ==="
$results = @()

foreach ($n in $videos) {
    $masterFile = Join-Path $masterBackupDir "video$n.mp4"
    $targetFile = Join-Path $publicDir "video$n.mp4"
    $tempOut = Join-Path $publicDir "video$($n)_crf17_temp.mp4"

    if (-not (Test-Path $masterFile)) {
        Write-Error "Master file missing for video$($n): $masterFile"
        continue
    }

    $origBytes = (Get-Item $masterFile).Length
    $origMb = [math]::Round($origBytes / 1MB, 2)

    Write-Host "Encoding video$n.mp4 (From: $origMb MB) with CRF 17..."
    $sw = [System.Diagnostics.Stopwatch]::StartNew()

    & $ffmpeg -i $masterFile -c:v libx264 -g 1 -keyint_min 1 -crf 17 -preset slow -pix_fmt yuv420p -an -movflags +faststart $tempOut -y 2>$null

    $sw.Stop()

    if ((Test-Path $tempOut) -and ((Get-Item $tempOut).Length -gt 100000)) {
        Move-Item $tempOut $targetFile -Force
        $newBytes = (Get-Item $targetFile).Length
        $newMb = [math]::Round($newBytes / 1MB, 2)
        $diffMb = [math]::Round(($origBytes - $newBytes) / 1MB, 2)
        $pct = [math]::Round((($origBytes - $newBytes) / $origBytes) * 100, 1)
        $sec = [math]::Round($sw.Elapsed.TotalSeconds, 1)

        Write-Host "[SUCCESS] video$n.mp4: $origMb MB -> $newMb MB (Hemat: $diffMb MB / $pct%) dalam $sec s"
        $results += [PSCustomObject]@{
            Slot = $n
            OldMB = $origMb
            NewMB = $newMb
            SavedMB = $diffMb
            Pct = $pct
            Bytes = $newBytes
        }
    } else {
        Write-Error "[FAILED] video$n.mp4 encode failed"
    }
}

Write-Host ""
Write-Host "=== SUMMARY OF ALL VIDEOS AT CRF 17 ==="
$results | Format-Table -AutoSize
