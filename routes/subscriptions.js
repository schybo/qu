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
			  .query('INSERT into Subscriptions (ClassNumber, Email) VALUES ($1, $2) RETURNING id',
			  [req.body.classNumber, req.body.email],
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

// _.each(terms.listings, function (termYear) {
// 	_.each(termYear, function (term) {
// 		if (term.id != '1171' && term.id != '1175' && term.id != '1179') {
// 			var data = require('../data/' + term.id + '.json');
// 			_.each(data, function (course) {
// 				console.log(course);
// 				client.query(
// 					'INSERT into likes (CatalogNumber, Subject, Likes) VALUES($1, $2, $3) RETURNING id', 
// 		            [course.catalog_number, course.subject, 0], 
// 		            function(err, result) {
// 		                if (err) {
// 		                    console.log(err);
// 		                } else {
// 		                    console.log('row inserted with id: ' + result.rows[0].id);
// 		                }
// 		            }
// 	            );
// 			});
// 		}
// 	});
// });
// client
//   .query('SELECT table_schema,table_name FROM information_schema.tables;')
//   .on('row', function(row) {
//     console.log(JSON.stringify(row));
//   });


