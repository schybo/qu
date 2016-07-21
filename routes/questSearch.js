require('dotenv').load();
// var uwapi = require('uwapi')(process.env.UW_API_TOKEN);
var _ = require('lodash');
var pg = require('pg');
var terms = require('../data/terms.json');

//We also want to let people make schedules

var hasCorrectProfessor = function (searched, professors, searchName) {
	if (searched) {
		if (professors.length > 0) {
			isCorrectProfessor = false;
			_.each(professors, function(professor) {
				_.each(searchName, function (namePart) {
					if (professor.toLowerCase().includes(namePart.toLowerCase())) {
						console.log(professor);
						console.log(namePart);
						isCorrectProfessor = true; return;
					}
				});
				if (isCorrectProfessor) { return; }
			});
			return isCorrectProfessor;
		} else {
			return false;
		}
	} else {
		return true;
	}
}

exports = module.exports = function(req, res) {
	var options = req.body;
	console.log(options);

	var data = require('../data/' + options.term + '.json');
	var returnData = data;
	var onlineCourse = false;
	var start_time = '';
	var end_time = '';
	var subjects = options.subjects.split(',');
	var name = options.professor.split(" ");

	if (options.campus == 'ONLN ONLINE') {
		onlineCourse = true;
	}

	console.log(options.time);
	if (options.time) {
		time = options.time.split('-');
		start_time = time[0];
		end_time = time[1];
	}

	//Filter by campus
	if (options.campus) {
		returnData = _.filter(data, function (course) {
			return course.campus == options.campus;
		});
	}
	// console.log(returnData);

	//Filter by course code
	if (options.subjects) {
		returnData = _.filter(returnData, function (course) {
			return subjects.indexOf(course.subject) > -1;
		});
	}
	// console.log(returnData);

	if (options.level) {
		returnData = _.filter(returnData, function (course) {
			if (options.level == '6') {
				return course.academic_level == 'graduate';
			} else {
				return course.catalog_number.charAt(0) == options.level;
			}
		});
	}
	// console.log(returnData);

	//Filter by day
	//We should be able to do this in one pass - just not sure how with lodash yet

	//For each course, search if any of it's classes match
	_.each(returnData, function (course, index) {
		returnData[index].filteredClasses = _.filter(returnData[index].classes, function (section) {
			if (onlineCourse) {
				return hasCorrectProfessor(options.professor, section.instructors, name);
			} else if (!options.days || section.date.weekdays == options.days) {
				if (options.time) {
					if (options.range == 'true' && section.date.start_time >= start_time && section.date.end_time <= end_time) {
						return hasCorrectProfessor(options.professor, section.instructors, name);
					} else if (options.range == 'false' && section.date.start_time == start_time && section.date.end_time == end_time) {
						return hasCorrectProfessor(options.professor, section.instructors, name);
					}
				} else {
					return hasCorrectProfessor(options.professor, section.instructors, name);
				}
			}
			return false;
		});
	});

	//Remove all courses that have no classes
	returnData = _.filter(returnData, function (course) {
		return course.filteredClasses.length != 0;
	});

	// console.log(returnData);
	res.json(returnData);
};