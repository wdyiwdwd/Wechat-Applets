var Group = require('../models').Group;
var config = require('../config');
var formidable = require('formidable');

exports.getUsers = function(req, res) {
  groupid = req.query.groupid;
  // console.log(Group);
  Group.find({
    where: {
      groupid: groupid
    }
  }).then(function (group) {
    group.getUsers({
      where: {}
    }).then(function (users) {
      // console.log(pictures);
      res.send(users);
    }, function () {
      res.status(500).send("Error");
    })
  }, function () {
    res.status(500).send("Error");
  })
}