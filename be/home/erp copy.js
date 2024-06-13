require('dotenv').config()
const express = require('express');
const router = express.Router();
const shortid = require('shortid');
const {resolve} = require('path');
const con = require(resolve('./configs/database'))
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require(resolve('./configs/auth'))
const si = require('systeminformation');
const network = require('network');
const osUtils = require('os-utils');
const moment = require('moment');  
const { v4: uuidv4 } = require('uuid');
const NodeMediaServer = require('node-media-server');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
const fs = require('fs');

function saveSystemInfo() {
  const cpu = osUtils.cpuUsage((value) => {
    const usage = value * 100;
    const ram = osUtils.totalmem() - osUtils.freemem();

    const systemInfo = {
      port: 8000,
      network,
      cpu: usage,
      ram
    };
    var systemFormat = {
      port : 8000,
      cpu :usage ,
      ram : ram
    }
    const systemInfoJson = JSON.stringify(systemInfo);
    const query = `UPDATE noah_systeminfo SET port=${systemInfo?.port}, cpu=${systemInfo?.cpu}, ram=${systemInfo?.ram} WHERE id=1`;
    con.query(query, (err) => {
      if (err) {
        console.error('Lỗi khi lưu thông tin hệ thống vào cơ sở dữ liệu MySQL:', err);
      } else {
        console.log(systemFormat);
      }
    });
  });
}

var createdAT = {
    id: 1,
    time : Date.now()
}

const streamKeys = [];
const secretKey = 'Noah-29281720##@@!!';
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
  con.query(`SELECT token FROM noah_streamkey WHERE isDeleted IS NULL AND token=${con.escape(token)}`,(err, result)=>{
    if(err) throw err
    var [data] = result
    if(data){
      try {
        const decoded = jwt.verify(token, secretKey);
        if (streamKeys.includes(decoded.streamKey) && decoded.streamKey === streamKey) {
          console.log('Authentication succeeded');
          return;
        }
      } catch (error) {
        console.log('Authentication failed');
      }
    }else{
      console.log('Authentication failed');
    }
  })
});

router.route('/')
.get((req, res)=>{
  saveSystemInfo()
    res.render(`${resolve('./fe/index')}`)
})

router.route('/stream-list')
.get((req, res)=>{
    con.query(`SELECT id, uuid, token, streamKey, createdAT FROM noah_streamkey`,(err, result)=>{
        if(err) throw err
        var data = result
        var dataFormat = []
        if(data){   
            for(var i = 0; i < data?.length;i++){
                dataFormat.push({
                    id: data[i]?.id,
                    uuid: data[i]?.uuid,
                    token: data[i]?.token,
                    link : data[i]?.streamKey,
                    key: `${req.protocol}://${req.headers.host}/`+data[i]?.streamKey,
                    created : moment(data[i]?.creatAT?.time).format("DD-MM-YYYY"),
                })
            }
            res.render(`${resolve('./fe/streamList')}`,{
                dataFormat:dataFormat
            })
        }else{
            res.send(404)
        }
    })
})
router.route('/creat-key')
.get((req,res)=>{
    res.render(`${resolve('./fe/creatKey')}`)
}).post((req,res)=>{
    var {isChecked} = req.body
    const streamKey = 'stream-' + Math.random().toString(36).substr(2, 8);
    var uuid= uuidv4();
    const token = jwt.sign({ streamKey }, secretKey);
    streamKeys.push(streamKey);
    con.query(`INSERT INTO noah_streamkey(uuid, token, streamKey, createdAT, status) VALUES (${con.escape(uuid)}, ${con.escape(token)}, ${con.escape(streamKey)}, ${con.escape(JSON.stringify(createdAT))}, ${con.escape(Number(isChecked))})`,(err, result)=>{
        if(err) throw err
        res.json({ status:200,data:{token: token, streamKey:streamKey, createdAT:createdAT}});
    })
})

router.route('/key/(:streamKey)?',) 
.get((req,res)=>{
  var {streamKey} = req.params
  con.query(`SELECT streamKey, status, token FROM noah_streamkey WHERE isDeleted IS NULL AND streamKey=${con.escape(streamKey)}`,(err, result)=>{
    if(err) throw err
    var [data] = result
    if(data){
        var dataFormat = {
          token : data?.token,
          status: data?.status,
          streamKey : `${req.protocol}://${req.headers.host}/`+data?.streamKey
        }
        res.render(`${resolve('./fe/detail')}`,{
          dataFormat:dataFormat
      })
    }
  })
})

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
module.exports = router