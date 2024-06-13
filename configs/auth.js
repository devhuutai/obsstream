require('dotenv').config()
const {resolve} = require("path")
const jwt = require('jsonwebtoken');
const con = require('./database');

exports.protect =  (req,res,next) =>{
  let token = '';
  if(req.cookies.noahToken){
      token = req.cookies.noahToken
  }
    if(!token){
      res.render(`${resolve('./fe/auth')}`)

  }else{
    try{
      const decode = jwt.verify(token, 'k5Zurj4!@##!Z!');
      var sql = `SELECT id, uuid, name, role FROM noah_auth WHERE uuid= ${con.escape(decode.uuid)}`;
      con.query(sql,(err,result)=>{
          if (err) throw err;
          var [user] = result;
         req.data = user
        next();
      });
    }
    catch(err){
      res.render(`${resolve('./fe/auth')}`)
    }
  }
}


