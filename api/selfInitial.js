var Wine = require('../models').Wine;
var User = require('../models').User;
var Group = require('../models').Group;
var GroupUser = require('../models').GroupUser;

exports.selfInitial = async function (req, res) {
  console.log(req.query);
  var user = await User.create({
    'wxid': req.query.wxid,
    'nickname': req.query.nickname,
    'avatar': req.query.avatar
  })
  if(req.query.openGId!='null') {
    var groups = await Group.findAll({
      'where': {
        'groupid': req.query.openGId
      }
    });
    if (groups.length === 0) {
      var group = await Group.create({
        'groupid': req.query.openGId
      })
      await group.addUser(user);
    } else {
      await groups[0].addUser(user);
    }
  }
  var num = req.query.questions.length;
  for(var i=0;i<3;i++) {
    var wine = await user.createWine({
      'type': req.query.questions[i].wine,
      'answer': req.query.choosedAnswer[i],
    })
  }
  res.send('selfInitial success!');
}