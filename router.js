var express = require('express');
var test = require('./api/testapi');
var blog = require('./api/blog');
var router = express.Router();

router.get('/', test.testapi)

router.get('/pictures', blog.getPictures)

module.exports = router;