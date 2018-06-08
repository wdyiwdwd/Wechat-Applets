var User = require('../models').User;
var config = require('../config');

exports.getUser = function(req, res) {
  var wxid = req.query.wxid;
  User.findOne({
    where: {
      wxid: wxid
    }
  }).then((user) => {
    res.send(user);
  })
}

exports.updateMotto = async function (req, res) {
  await User.update({
    'motto': req.query.motto
    },
    {
      where: {
        'wxid': req.query.wxid
      }
    }
  );
  res.send('updateMotto success!');
}