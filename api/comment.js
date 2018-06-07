var Comment = require('../models').Comment;
var Group = require('../models').Group;
var db = require('../models').DB;
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

exports.getComments = function(req, res) {
  var groupid = req.query.groupid;
  var toid = req.query.toid;
  db.query(
    'SELECT fromid, toid, a.avatar, a.nickname, content, comments.createdAt, a.level, a.motto FROM `comments` join `groups` on `comments`.groupId = `groups`.id join users as a on a.wxid = `comments`.fromid join `users` as b on b.wxid = `comments`.toid WHERE `groups`.groupid = :groupid and `comments`.toid = :toid',
    { raw: true, replacements: { groupid: groupid, toid: toid} }
  )
    .then(data => {
      console.log(data)
      result = [];
      data.forEach((value) => {
        result.push(value[0])
      }) 
      res.send(result);
    })
}