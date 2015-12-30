require('dotenv').load();
var uwapi = require('uwapi')(process.env.UW_API_TOKEN);
var _ = require('lodash');
var data = require('../cronjobs/1151.json');

exports = module.exports = function(req, res) {
	var options = req.body;
	console.log(options);
	var returnData = {};
	var onlineCourse = false;
	var start_time = '';
	var end_time = '';

	if (options.campus == 'ONLN ONLINE') {
		onlineCourse = true;
	}

	if (options.time) {
		time = options.time.split('-');
		start_time = time[0];
		end_time = time[1];
	}
	//Currently have options.term, options.campus, options.days
	if (options.campus) {
		returnData = _.filter(data, function (course) {
			return course.campus == options.campus;
		});
	}

	// console.log(returnData);
	//Filter by day
	if (options.days && !onlineCourse) {
		//We should be able to do this in one pass - just not sure how with lodash yet

		//For each course, search if any of it's classes match
		_.each(returnData, function (course, index) {
			returnData[index].filteredClasses = _.filter(returnData[index].classes, function (section) {
				if (section.date.weekdays == options.days) {
					if (options.time) {
						if (section.date.start_time == start_time && section.date.end_time == end_time) {
							return true;
						}
					} else {
						return true;
					}
				}
				return false;
			});
		});

		//Remove all courses that have no classes
		returnData = _.filter(returnData, function (course) {
			return course.filteredClasses.length != 0;
		});
	}

	// console.log(returnData);
	res.json(returnData);
};