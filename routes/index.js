var express = require('express');
var questLoad = require('./questLoad');
var questSearch = require('./questSearch');
var subscriptions = require('./subscriptions');
var like = require('./like');
var router = express.Router();

router.post('/', questSearch);
router.post('/sub', subscriptions);
router.post('/like', like);

router.get('/faq', function(req, res){ 
	res.render('faq');
});

router.get('*', questLoad);

module.exports = router;
