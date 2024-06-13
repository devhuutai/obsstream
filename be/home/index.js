require('dotenv').config();
const express = require('express');
const router = express.Router();
const { resolve } = require('path');
const jwt = require('jsonwebtoken');
const NodeMediaServer = require('node-media-server');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const con = require(resolve('./configs/database'))
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
const fs = require('fs');

router.route('/(:uuid)')
.get((req, res)=>{
  var {uuid} = req.params
  if(uuid){
    con.query(`SELECT streamKey, token, status FROM noah_streamkey WHERE isDeleted IS NULL AND uuid=${con.escape(uuid)};
   `, (err, result)=>{
      if(err) throw err
      var [data] = result
      if(data){
        var dataFormat = {
          streamKey: data?.streamKey,
          status: data?.status,
          token : data?.token
        }
        res.render(`${resolve('./fe/playStream')}`,{
          dataFormat : dataFormat
        })
      }else{
        res.send('https://t.me/NodejsdevBE')
      }
    })
  }else{
    res.send('https://t.me/NodejsdevBE')
  }
})


module.exports = router;
