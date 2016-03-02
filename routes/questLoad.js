require('dotenv').load();
// var uwapi = require('uwapi')(process.env.UW_API_TOKEN);
var _ = require('lodash');
var request = require('request');
var terms = null;
var subjects = null;
var bucket = 'https://s3.amazonaws.com/uwcourses.data/'

exports = module.exports = function(req, res) {
	request(bucket + 'subjects.json', function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    subjects = body;
	    console.log(subjects);
	    request(bucket + 'terms.json', function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		    terms = body;
		    console.log(terms);
		    termOptions = [];
			_.each(terms.listings, function (termYear) {
				_.each(termYear, function (term) {
					termOptions.push(term);
				});
			});
			console.log(termOptions);
			res.render('home', {'terms': termOptions, 'subjects': subjects, 'nextTerm': terms.current_term});
		  } else {
		  	console.log(error);
		  }
		});
	  } else {
	  	console.log(error);
	  }
	});
};