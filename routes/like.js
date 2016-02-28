// var mandrill = require('mandrill-api/mandrill');
// var mandrill_client = new mandrill.Mandrill('hZ0uqN6TtFEI4v6v7J35iA');
var pg = require('pg');
// var terms = require('../data/terms.json');
var _ = require('lodash');

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
			  		res.json({"error" : err, "status" : 500})
			  	} else {
			  		console.log('row inserted with id: ' + result.rows[0].id);
			  	}
			  });
		});
	} catch (err) {
		res.json({"error" : err, "status" : 500});
	}
	res.json({"success" : "Updated Successfully", "status" : 200});
}