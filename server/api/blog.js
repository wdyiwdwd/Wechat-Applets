var Picture = require('../models').Picture;
var Group = require('../models').Group;
var config = require('../config');
var formidable = require('formidable');
var fs = require('fs');

exports.getPictures = async function (req, res) {
  groupid = req.query.groupid;
  // console.log(Group);
  Group.find({
    where: {
      groupid: groupid
    }
  }).then(function (group) {
    group.getPictures({
      where:{},
      order: [
      ['createdAt', 'DESC'],
      ['id']
      ]
    }).then(function(pictures) {
      // console.log(pictures);
      res.send(pictures);
      }, function () {
         res.status(500).send("Error");
      })
  }, function () {
    res.status(500).send("Error");
  });
}

exports.uploadPicture = async function(req, res) {
  var form = new formidable.IncomingForm();   //创建上传表单
  form.encoding = 'utf-8';        //设置编辑
  form.uploadDir = config.upload.path;     //设置上传目录
  form.keepExtensions = true;     //保留后缀
  form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小

  fs.exists(form.uploadDir, function (exists) {
    if (!exists) fs.mkdirSync(form.uploadDir);
  })

  form.parse(req, function (err, fields, files) {
    if (err) {
      res.locals.error = err;
      res.send("表单错误！");
      return;
    }
    console.log(files.uploadPicture.path);
    console.log(fields);
    //图片写入地址；
    var newPath = form.uploadDir + fields.groupid + '/';
    // var newPath = form.uploadDir + '2' + '/';
    fs.exists(newPath, function (exists) {
      console.log(exists ? "有" : "没有");
      console.log("newPath", newPath);
      if (!exists) fs.mkdirSync(newPath);
      theFiles = fs.readdirSync(newPath);
      newName = (theFiles.length + 1) + '.' + files.uploadPicture.name.substr(-3, 3);
      console.log("newName", newName);
      fs.renameSync(files.uploadPicture.path, newPath + newName);  //重命名
      Group.findOne({
        where: {
          groupid: fields.groupid
        }
      }).then(function(group) {
        Picture.create({
          path: config.upload.url + fields.groupid + '/' + newName
        }).then(function(picture) {
          group.addPictures([picture])
          res.send(picture);
        })
      })
    });  
  });
}

exports.addRemark = async function (req, res) {
  var form = new formidable.IncomingForm();   //创建上传表单
  form.encoding = 'utf-8';        //设置编辑
  form.keepExtensions = true;     //保留后缀
  form.parse(req, function (err, fields, files) {
    console.log("files", files);
    console.log("fields", fields);
    Picture.update(
      { 'text': fields.remark },
      {
        'where': {
          'id': fields.pictureId
        }
      }
    ).then(function(picture){
      Picture.findOne({where:{'id': fields.pictureId}}).then(function(picture){
        res.send(picture);
      })
    });
  })
}
