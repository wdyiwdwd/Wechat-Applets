//express_demo.js 文件
var Model = require('./models');
var config = require('./config');
var router = require('./router');
var express = require('express');
var app = express();

app.use('/', router)

app.use('/upload',express.static('upload'));

var server = app.listen(config.port, function () {
 
  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)
  
})

module.exports = app;