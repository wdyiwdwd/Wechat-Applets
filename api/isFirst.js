var User = require('../models').User;

exports.isFirst = async function (req, res) {
  var users = await User.findAll({
    'where': {
      'wxid':req.query.openid
    }
  });
  //console.log(users);
  var isFirst=(users.length===0);
  res.send({
    isFirst: isFirst
  })
}