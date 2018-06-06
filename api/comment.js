var Comment = require('../models').Comment;
var Group = require('../models').Group;
var config = require('../config');
var formidable = require('formidable');

exports.addComment = function(req, res) {
  var form = new formidable.IncomingForm();   //创建上传表单
  form.encoding = 'utf-8';        //设置编辑
  form.keepExtensions = true;     //保留后缀
  form.parse(req, function (err, fields, files) {
    console.log("fields", fields);
    Group.findOne({
      where: {
        groupid: fields.groupid
      }
    }).then(function (group){
      Comment.create({
        fromid: fields.fromid,
        toid: fields.toid,
        content: fields.content
      }).then(function (comment) {
        group.addComments([comment]);
        res.send(comment);
      })
    })
  })
}