require('dotenv').config();
const express = require('express');
const router = express.Router();
const { resolve } = require('path');
const jwt = require('jsonwebtoken');
const NodeMediaServer = require('node-media-server');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
const fs = require('fs');

const streamKeys = [];
const secretKey = 'your-secret-key';
const config = {
  rtmp: {
    port: 8080,
    chunk_size: 4096,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  }
};

const nms = new NodeMediaServer(config);
nms.run();

nms.on('prePublish', async (id, StreamPath, args) => {
  const streamKey = StreamPath.split('/')[2];
  const token = args.token;
  try {
    const decoded = jwt.verify(token, secretKey);
    if (streamKeys.includes(decoded.streamKey) && decoded.streamKey === streamKey) {
      console.log('Authentication succeeded');
      return;
    }
  } catch (error) {
    console.log('Authentication failed');
  }
});

router.get('/streamkey', (req, res) => {
  const streamKey = 'stream-' + Math.random().toString(36).substr(2, 8);
  const token = jwt.sign({ streamKey }, secretKey);
  streamKeys.push(streamKey);
  res.json({ streamKey, token });
});

const createStreamDirectory = (streamKey) => {
  const streamDirectory = resolve(`./public/noah/${streamKey}`);
  fs.mkdirSync(streamDirectory, { recursive: true });
  return streamDirectory;
};

nms.on('postPublish', (id, StreamPath, args) => {
  const streamKey = StreamPath.split('/')[2];
  const streamDirectory = createStreamDirectory(streamKey);
  console.log(streamDirectory)
  const hlsConfig = {
    hls_list_size: 0,
    hls_time: 0.1,
    hls_segment_filename: `${streamDirectory}/segment_%d.ts`,
    hls_playlist_type: 'event',
    hls_flags: 'delete_segments'
  };
  const ffmpegCommand = ffmpeg(`rtmp://localhost:8080${StreamPath}`)
  .outputOptions('-f', 'hls')
  .outputOptions('-hls_list_size', hlsConfig.hls_list_size)
  .outputOptions('-hls_time', hlsConfig.hls_time)
  .outputOptions('-hls_segment_filename', hlsConfig.hls_segment_filename)
  .outputOptions('-hls_playlist_type', hlsConfig.hls_playlist_type)
  .outputOptions('-hls_flags', hlsConfig.hls_flags)
  .outputOptions('-preset', 'ultrafast') // Sử dụng preset tối ưu hóa cho tốc độ xử lý nhanh hơn
  .output(`${streamDirectory}/playlist.m3u8`)
  .on('end', () => {
    console.log('Đã tạo file m3u8 và segment thành công');
  })
  .on('error', (error) => {
    console.error(`Lỗi khi chạy lệnh ffmpeg: ${error.message}`);
  });
  ffmpegCommand.run();
});

router.route('/test')
.get((req, res)=>{
    res.render(`${resolve('./fe/test')}`)
})

module.exports = router;
