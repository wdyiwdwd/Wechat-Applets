var express = require('express');
var test = require('./api/testapi');
var selfInitial = require('./api/selfInitial');
var isFirst = require('./api/isFirst');
var getGid = require('./api/getGid');
var onShare = require('./api/onShare');
var blog = require('./api/blog');
var comment = require('./api/comment');
var group = require('./api/group');
var user = require('./api/user');
var wine = require('./api/wine');
var router = express.Router();

router.get('/', test.testapi);
router.get('/selfInitial', selfInitial.selfInitial);
router.get('/isFirst', isFirst.isFirst);
router.get('/getGid', getGid.getGid);
router.get('/onShare', onShare.onShare);
router.get('/getuser', user.getUser)
router.get('/getusers', group.getUsers)
router.get('/getWines', wine.getWines);
router.get('/updateMotto', user.updateMotto);
router.get('/updateWines', wine.updateWines);

router.get('/pictures', blog.getPictures)

router.get('/getcomments', comment.getComments)

router.post('/uploadpicture', blog.uploadPicture)

router.post('/addremark', blog.addRemark)

router.post('/addcomment', comment.addComment)

module.exports = router;