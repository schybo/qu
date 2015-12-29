var http          = require('http');
var app           = require('./app');

var port          = process.env.PORT || 3030;

http.createServer(app).listen(port, function() {
	console.log('http://0.0.0.0:' + port);
});
