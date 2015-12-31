require('dotenv').load();
// var uwapi = require('uwapi')(process.env.UW_API_TOKEN);
var _ = require('lodash');
var terms = require('../data/terms.json');
var subjects = require('../data/subjects.json');

exports = module.exports = function(req, res) {
	termOptions = []
	_.each(terms.listings, function (termYear) {
		_.each(termYear, function (term) {
			termOptions.push(term);
		});
	});
	console.log(termOptions);

	// subjectOptions = []
	// _.each(subjects, function (subject) {
	// 	subjectOptions.push(subject.subject);
	// });
	// console.log(subjectOptions);

	// You should probably scrape the times too!

	// console.log(termOptions);
	res.render('home', {'terms': termOptions, 'subjects': subjects, 'nextTerm': terms.next_term});
};