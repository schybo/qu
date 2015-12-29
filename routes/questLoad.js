require('dotenv').load();
var uwapi = require('uwapi')(process.env.UW_API_TOKEN);
var _ = require('lodash');

exports = module.exports = function(req, res) {
	uwapi.termsList().then(function(terms) {
		termOptions = []
		_.each(terms.listings, function (termYear) {
			_.each(termYear, function (term) {
				termOptions.push(term);
			});
		});
		console.log(termOptions);
		res.render('home', {'terms': termOptions});
	});
};