"use strict";
const port = 8000;
const express = require("express");
const {resolve} = require('path');
const bodyParser = require('body-parser')
const session = require("express-session");
const cookieParser = require("cookie-parser");
const app = express();
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json())
app.use(cookieParser());
app.enable("trust proxy", 1); 
app.set("view engine", "ejs");
app.use("/", express.static("public"));
app.use("/", require("./be"));
app.set('views', './fe/');
app.set('view engine', 'ejs');

app.use('/',express.static('public'))
app.use(
    session({
      secret: "k5Zurj4!@##!Z!",
      saveUninitialized: true,
      cookie: { maxAge: 31536000 },
      resave: true,
    })
  );
  
app.use((req, res, next) => {
  next();
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

module.exports = app;