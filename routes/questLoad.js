require('dotenv').load();
// var uwapi = require('uwapi')(process.env.UW_API_TOKEN);
var _ = require('lodash');
var terms = require('../cronjobs/terms.json');

exports = module.exports = function(req, res) {
	termOptions = []
	_.each(terms.listings, function (termYear) {
		_.each(termYear, function (term) {
			termOptions.push(term);
		});
	});
	console.log(terms);
	// console.log(termOptions);
	res.render('home', {'terms': termOptions, 'nextTerm': terms.next_term});
};