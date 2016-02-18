var express = require('express');
var questLoad = require('./questLoad');
var questSearch = require('./questSearch');
var subscriptions = require('./subscriptions');
var router = express.Router();

router.post('/', questSearch);
router.post('/sub', subscriptions);

router.get('*', questLoad);

module.exports = router;
