require('dotenv').load();
var uwapi = require('uwapi')(process.env.UW_API_TOKEN);
var _ = require('lodash');

exports = module.exports = function(req, res) {
	var data = req.body;
	var courseMatches = [];
	//Currently have data.term, data.campus, data.days
	uwapi.codesSubjects().then(function(subjects) {
		//You should probably cache subjects to be faster....Yah (then his them up like every week on cronjob)
		console.log(subjects);
		_.each(subjects, function (subject) {
			console.log(data.term);
			console.log(subject.subject);
			uwapi.termsSchedule({'term_id': data.term, 'subject': subject.subject}).then(function(courses) {
				console.log(courses);
				courseMatches.concat(courses);
			});
		});

		console.log(courseMatches);
		debugger;
		//Filter by campus
		if (data.campus) {
			courseMatches = _filter(courseMatches, function (course) {
				return course.campus == data.campus;
			});
		}

		//Filter by day
		if (data.days) {
			courseMatches = _filter(courseMatches, function (course) {
				for (var i=0; i < course.classes.length; i++) {
					classInfo = course.classes[i];
					if (classInfo.dates.weekdays == data.days) {
						return true
					}
				}
			});
		}

		res.json(courseMatches);
	});
};