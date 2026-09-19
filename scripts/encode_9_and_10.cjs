const { execSync } = require('child_process');
const ffmpeg = require('@ffmpeg-installer/ffmpeg').path;
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, '..', 'public', 'video', 'video-home');
const outputDir = path.join(inputDir, 'intra');

[9, 10].forEach((i) => {
  const inputFile = path.join(inputDir, `home${i}.mp4`);
  const outputFile = path.join(outputDir, `home${i}_intra.mp4`);

  console.log(`Encoding home${i}.mp4 with CRF 15 -> home${i}_intra.mp4...`);
  const start = Date.now();
  try {
    execSync(`"${ffmpeg}" -i "${inputFile}" -c:v libx264 -g 1 -keyint_min 1 -crf 15 -preset medium -pix_fmt yuv420p -an -movflags +faststart "${outputFile}" -y`);
    const durationSec = ((Date.now() - start) / 1000).toFixed(1);
    const inMb = (fs.statSync(inputFile).size / (1024*1024)).toFixed(1);
    const outMb = (fs.statSync(outputFile).size / (1024*1024)).toFixed(1);
    console.log(`✓ home${i} encoded in ${durationSec}s | Original: ${inMb}MB -> Crisp Intra: ${outMb}MB`);
  } catch (err) {
    console.error(`✗ Error encoding home${i}:`, err.message);
  }
});

console.log('Done encoding home9 and home10!');
