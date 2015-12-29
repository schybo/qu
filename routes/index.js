var express = require('express');
var questSearch = require('./questSearch');
var router = express.Router();

router.get('/api/uw', questSearch);

router.get('*', function (req, res) {
  res.render('home');
});

module.exports = router;
