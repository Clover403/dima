const { execSync } = require('child_process');
const ffmpeg = require('@ffmpeg-installer/ffmpeg').path;
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, '..', 'public', 'video', 'video-home');
const outputDir = path.join(inputDir, 'intra');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('--- Starting All-Intra Encoding for Home Videos 1 to 9 ---');

for (let i = 1; i <= 9; i++) {
  const inputFile = path.join(inputDir, `home${i}.mp4`);
  const outputFile = path.join(outputDir, `home${i}_intra.mp4`);

  if (!fs.existsSync(inputFile)) {
    console.warn(`File not found: ${inputFile}`);
    continue;
  }

  console.log(`Re-encoding home${i}.mp4 with CRF 15 (Ultra Crisp) -> home${i}_intra.mp4...`);
  const start = Date.now();
  try {
    // -crf 15 ensures visually lossless preservation of fine line drawings
    // -preset medium ensures optimal macroblock partitioning without compression blurring
    // -g 1 ensures every frame is an I-frame for instantaneous scroll scrub
    execSync(`"${ffmpeg}" -i "${inputFile}" -c:v libx264 -g 1 -keyint_min 1 -crf 15 -preset medium -pix_fmt yuv420p -an -movflags +faststart "${outputFile}" -y`);
    const durationSec = ((Date.now() - start) / 1000).toFixed(1);
    const inMb = (fs.statSync(inputFile).size / (1024*1024)).toFixed(1);
    const outMb = (fs.statSync(outputFile).size / (1024*1024)).toFixed(1);
    console.log(`✓ home${i} encoded in ${durationSec}s | Original: ${inMb}MB -> Crisp Intra: ${outMb}MB`);
  } catch (err) {
    console.error(`✗ Error encoding home${i}:`, err.message);
  }
}

console.log('--- All Videos Processed! ---');
