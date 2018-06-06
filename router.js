var express = require('express');
var test = require('./api/testapi');
var blog = require('./api/blog');
var comment = require('./api/comment');
var router = express.Router();

router.get('/', test.testapi)

router.get('/pictures', blog.getPictures)

router.post('/uploadpicture', blog.uploadPicture)

router.post('/addremark', blog.addRemark)

router.post('/addcomment', comment.addComment)

module.exports = router;