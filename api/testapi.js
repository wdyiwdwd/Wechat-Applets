var Test = require('../models').Test;

exports.testapi = async function(req, res) {
  var test = await Test.create({
    'name': 'Production',
    'email': '@qq.com'
  });
	res.send('YES World');
}