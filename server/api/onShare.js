var Group = require('../models').Group;
var User = require('../models').User;
var GroupUser = require('../models').GroupUser;

exports.onShare = async function (req, res) {
  var user = await User.findOne({
    'where': {
      'wxid': req.query.wxid
    }
  });
  var groups = await Group.findAll({
    'where': {
      'groupid': req.query.openGId
    }
  });
  if(groups.length===0) {
    var group = await Group.create({
      'groupid': req.query.openGId
    })
    await group.addUser(user);
  } else {
    await groups[0].addUser(user);
  }
  res.send('onShare success!');
}