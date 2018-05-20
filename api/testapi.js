var config = require('../config');
var Test = require('../models').Test;

exports.testapi = function(req, res) {
	docu = new Test({name: 'testapi'})
	docu.save();
	res.send('YES World');
}