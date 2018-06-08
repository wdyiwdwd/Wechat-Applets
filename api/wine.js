var User = require('../models').User;
var Wine = require('../models').Wine;
var config = require('../config');

exports.getWines = async function (req, res) {
  var user = await User.findOne({
    where: {
      wxid: req.query.wxid
    }
  })
  var wines = await user.getWines({
    'where': {}
  })
  res.send(wines);
}

exports.updateWines = async function (req, res) {
  var choosedAnswer = JSON.parse(req.query.choosedAnswer);
  var user = await User.findOne({
    where: {
      wxid: req.query.wxid
    }
  })
  var wines = await user.getWines({
    'where': {}
  })
  for (var i=0;i<wines.length;i++) {
    await wines[i].destroy();
  }
  for (var i = 0; i < choosedAnswer.length; i++) {
    if (choosedAnswer[i] != undefined) {
      var wine = await user.createWine({
        'type': i,
        'answer': choosedAnswer[i],
      })
    }
  }
  res.send('updateWines success!');
}