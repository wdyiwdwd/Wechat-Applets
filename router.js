var express = require('express');
var test = require('./api/testapi');
var router = express.Router();

router.get('/', test.testapi)

module.exports = router;