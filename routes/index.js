var express = require('express');
var questLoad = require('./questLoad');
var questSearch = require('./questSearch');
var router = express.Router();

router.post('/', questSearch);

router.get('*', questLoad);

module.exports = router;
