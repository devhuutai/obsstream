require('dotenv').config()
var mysql = require('mysql2');
var connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password : '123456',
    database: 'obstreamnoah',
    multipleStatements: true

});

module.exports = connection
