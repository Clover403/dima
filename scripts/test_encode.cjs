const { execSync } = require('child_process');
const ffmpeg = require('@ffmpeg-installer/ffmpeg').path;
const fs = require('fs');

console.log('Testing encoding home1 with -g 1...');
const start = Date.now();
try {
  execSync(`"${ffmpeg}" -i "public/video/video-home/home1.mp4" -c:v libx264 -g 1 -keyint_min 1 -crf 23 -preset veryfast -pix_fmt yuv420p -an -movflags +faststart "public/video/video-home/test_home1_intra.mp4" -y`);
  console.log('Done in', ((Date.now() - start)/1000).toFixed(2), 's');
  console.log('Original size:', (fs.statSync('public/video/video-home/home1.mp4').size / (1024*1024)).toFixed(2), 'MB');
  console.log('Intra size:', (fs.statSync('public/video/video-home/test_home1_intra.mp4').size / (1024*1024)).toFixed(2), 'MB');
} catch (e) {
  console.error('Error:', e.message);
}
