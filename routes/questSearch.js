require('dotenv').load();
var uwapi = require('uwapi')(process.env.UW_API_TOKEN);
var _ = require('lodash');

exports = module.exports = function(req, res) {
	uwapi.buildingsList().then(function(buildings) {
		// console.log(buildings);
		res.json(buildings);
	});
};