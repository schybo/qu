var express      = require('express');
var path         = require('path');
var favicon      = require('static-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var limits       = require('limits');

var routes = require('./routes/index');

var app = express();

//Limits configuration
var limits_config = {
	enable        : true,
	file_uploads  : true,
	post_max_size : 1048580 //1MB
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.use(favicon(path.join(__dirname, 'public/images/favicons/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

app.use(limits(limits_config)); // limit size of uploads to lessen the impact of DoS attempts
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

module.exports = app;
