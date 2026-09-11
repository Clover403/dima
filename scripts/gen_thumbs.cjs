const { execSync } = require('child_process');
const ffmpeg = require('@ffmpeg-installer/ffmpeg').path;
const fs = require('fs');

const thumbDir = 'public/video/video-home/thumbs';
if (!fs.existsSync(thumbDir)) fs.mkdirSync(thumbDir, { recursive: true });

for (let i = 1; i <= 9; i++) {
  try {
    const input = `public/video/video-home/home${i}.mp4`;
    const output = `${thumbDir}/thumb${i}.jpg`;
    execSync(`"${ffmpeg}" -ss 00:00:02 -i "${input}" -vframes 1 -q:v 2 "${output}" -y`);
    console.log(`Generated thumb${i}.jpg`);
  } catch (e) {
    console.error(`Error for home${i}:`, e.message);
  }
}
