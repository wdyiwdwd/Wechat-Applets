var express = require('express');
var test = require('./api/testapi');
var selfInitial = require('./api/selfInitial');
var isFirst = require('./api/isFirst');
var getGid = require('./api/getGid');
var onShare = require('./api/onShare');
var router = express.Router();

router.get('/', test.testapi);
router.get('/selfInitial', selfInitial.selfInitial);
router.get('/isFirst', isFirst.isFirst);
router.get('/getGid', getGid.getGid);
router.get('/onShare', onShare.onShare);

module.exports = router;