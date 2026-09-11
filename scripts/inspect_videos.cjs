const { execSync } = require('child_process');
const ffmpeg = require('@ffmpeg-installer/ffmpeg').path;

for (let i = 1; i <= 9; i++) {
  try {
    const res = execSync(`"${ffmpeg}" -i "public/video/video-home/home${i}.mp4" 2>&1`).toString();
    const dur = (res.match(/Duration:\s*([^,]+)/) || [])[1];
    const vid = (res.match(/Video:\s*([^\r\n]+)/) || [])[1];
    console.log(`home${i}.mp4: Duration = ${dur} | ${vid}`);
  } catch (e) {
    const out = e.stdout ? e.stdout.toString() : '';
    const dur = (out.match(/Duration:\s*([^,]+)/) || [])[1];
    const vid = (out.match(/Video:\s*([^\r\n]+)/) || [])[1];
    console.log(`home${i}.mp4: Duration = ${dur} | ${vid}`);
  }
}
