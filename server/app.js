//express_demo.js 文件
var Model = require('./models');
var config = require('./config');
var router = require('./router');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use('/', router)

app.use(config.upload.url, express.static(config.upload.path));

app.use(bodyParser({
  uploadDir: config.upload.path,
  keepExtensions: true,
  limit: 10000000
}));

var server = app.listen(config.port, function () {
 
  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)
  
})

module.exports = app;