var config = require('../config');
var formidable = require('formidable');
var https = require('https');

exports.getOpenid = function(req ,res) {
  var form = new formidable.IncomingForm();   //创建上传表单
  form.encoding = 'utf-8';        //设置编辑
  form.keepExtensions = true;     //保留后缀
  form.parse(req, function (err, fields, files) {
    var code = fields.code;
    var apiurl = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + config.appid + '&secret=' + config.secret + '&js_code=' + code + '&grant_type=authorization_code';
    https.get(apiurl, (sres) => {
      var statusCode = sres.statusCode;
      var contentType = sres.headers['content-type'];

      sres.setEncoding('utf8');
      let rawData = '';
      sres.on('data', (chunk) => {rawData += chunk; console.log(chunk);});
      sres.on('end', () => {
        try {
          let parsedData = JSON.parse(rawData);
          res.json(parsedData);
        } catch (e) {
          res.status(500).send(e.message);
        }
      });
    }).on('error', (e) => {
      console.log(`Got error: ${e.message}`);
      res.status(500).end();
    });
  });
}