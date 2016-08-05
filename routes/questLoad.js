require('dotenv').load();
// var uwapi = require('uwapi')(process.env.UW_API_TOKEN);
var _ = require('lodash');
var terms = require('../data/terms.json');
var subjects = require('../data/subjects.json');
var winston = require('winston');

winston.level = process.env.LOG_LEVEL;

exports = module.exports = function(req, res) {
	termOptions = []
	_.each(terms.listings, function (termYear) {
		_.each(termYear, function (term) {
			termOptions.push(term);
		});
	});

	winston.log('info', 'SITE LOAD', termOptions);
	res.render('home', {'terms': termOptions, 'subjects': subjects, 'nextTerm': terms.next_term});
};