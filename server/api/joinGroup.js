var Group = require('../models').Group;
var User = require('../models').User;
var GroupUser = require('../models').GroupUser;

exports.joinGroup = async function (req, res) {
  var users = await User.findAll({
    'where': {
      'wxid': req.query.wxid
    }
  });
  var groups = await Group.findAll({
    'where': {
      'groupid': req.query.openGId
    }
  });
  if (users.length > 0) {
    await groups[0].addUser(users[0]);
  } 
  res.send('joinGroup success!');
}