var User = require('../models').User;

exports.isFirst = async function (req, res) {
  var users = await User.findAll({
    'where': {
      'wxid':req.query.openid
    }
  });
  //console.log(users);
  var isFirst=(users.length===0);
  if(!isFirst) {
    res.send({
      isFirst: isFirst,
      nickname: users[0].nickname,
      avatar: users[0].avatar
    })
  } else {
    res.send({
      isFirst: isFirst
    })
  }
}