const { execSync } = require('child_process');
const ffmpeg = require('@ffmpeg-installer/ffmpeg').path;
const fs = require('fs');

execSync(`"${ffmpeg}" -ss 00:00:03 -i "public/video/video-home/home1.mp4" -vframes 1 -q:v 2 "public/video/video-home/thumbs/orig_frame.jpg" -y`);
execSync(`"${ffmpeg}" -ss 00:00:03 -i "public/video/video-home/intra/home1_intra.mp4" -vframes 1 -q:v 2 "public/video/video-home/thumbs/intra_frame.jpg" -y`);

console.log('Original frame size:', fs.statSync('public/video/video-home/thumbs/orig_frame.jpg').size);
console.log('Intra frame size:', fs.statSync('public/video/video-home/thumbs/intra_frame.jpg').size);
