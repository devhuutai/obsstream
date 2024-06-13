require('dotenv').config();
const express = require('express');
const router = express.Router();
const { resolve } = require('path');
const jwt = require('jsonwebtoken');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const con = require(resolve('./configs/database'))
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
const bcrypt = require('bcrypt');
const auth = require(resolve('./configs/auth'))

const checkPermission = (req,res,next)=>{
    let {role} = req?.data;
    if(role === 'admin'){
        next()
    }
    else{
        res.render(`${resolve('./fe/auth')}`)

    }
}
router.route('/')
.get(auth.protect,checkPermission,(req,res,next)=>{ // kiểm tra trạng thái đăng nhập
    if(req?.data){
        res.redirect('/erp')
    }else{
        res.render(`${resolve('./fe/auth')}`,{})
    }
})
.post((req,res,next)=>{ //login
    const {name, password} = req.body
    console.log(req?.body)
    if(name && password){
        con.query(`SELECT * FROM noah_auth WHERE name = ${con.escape(name)}`,async (err,result)=>{
            if(err) throw err;
            let [data] = result
            if(data){
                const checkPassword = await bcrypt.compare(password,data.password)
      
                if(checkPassword){
                    var token = jwt.sign({uuid:data.uuid,username:data?.name,role:data?.role}, 'k5Zurj4!@##!Z!',{ expiresIn: '12h' });
                    res.cookie('noahToken', token, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true }); // maxAge: 2 hours
                    res.json({status:200})
                }
                else{
                    res.redirect('/')
                }
            }
            else{
                res.redirect('/')
            }
        })
    }else{
        res.redirect('/')
    }
})


module.exports = router;
