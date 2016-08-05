var pg = require('pg');
var _ = require('lodash');
var winston = require('winston');

winston.level = process.env.LOG_LEVEL;

exports = module.exports = function(req, res) {
	try {
		pg.connect(process.env.DATABASE_URL + '?ssl=true', function(err, client) {
			if (err) throw err;
			console.log('Connected to postgres!');
			client
			  .query('UPDATE Likes SET Likes = Likes + 1 WHERE CatalogNumber = $1 AND Subject = $2 RETURNING id',
			  [req.body.catalogNumber, req.body.subject],
			  function(err, result) {
			  	if (err) {
			  		res.json({"error" : err, "status" : 500});
			  		winston.log('error', 'error liking', err);
			  	} else {
			  		console.log(result);
			  		if (result.rows.length > 0) {
			  			winston.log('info', 'row inserted with id: ' + result.rows[0].id);
			  		} else {
			  			res.json({"error" : "Could not get inserted row id", "status" : 500});
			  			winston.log('error', 'error liking for unknown reason');
			  		}
			  	}
			  });
		});
	} catch (err) {
		res.json({"error" : err, "status" : 500});
		winston.log('error', 'error liking part deux', err);
	}
	res.json({"success" : "Updated Successfully", "status" : 200});
}