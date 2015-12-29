require('dotenv').load();
var uwapi = require('uwapi')(process.env.UW_API_TOKEN);
var _ = require('lodash');
var data1151 = require('../cronjobs/1151.json');

exports = module.exports = function(req, res) {
	var options = req.body;
	//Currently have options.term, options.campus, options.days
	if (options.campus) {
		data = _filter(data, function (course) {
			return course.campus == options.campus;
		});
	}

	//Filter by day
	if (options.days) {
		data = _filter(data, function (course) {
			for (var i=0; i < course.classes.length; i++) {
				classInfo = course.classes[i];
				if (classInfo.dates.weekdays == options.days) {
					return true
				}
			}
		});
	}

	res.json(data);
};