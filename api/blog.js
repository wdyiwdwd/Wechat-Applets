var Picture = require('../models').Picture;
var Group = require('../models').Group;

exports.getPictures = async function (req, res) {
  groupid = req.query.groupid;
  console.log(Group);
  Group.find({
    where: {
      groupid: groupid
    }
  }).then(function (group) {
    group.getPictures({
      where:{}
    }).then(function(pictures) {
      console.log(pictures);
      res.send(pictures);
      }, function () {
         res.status(500).send("Error");
      })
  }, function () {
    res.status(500).send("Error");
  });
}