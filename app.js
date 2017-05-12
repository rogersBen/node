
var http = require('http');
var mongoose = require('mongoose');
var express = require('express');

//Define variables to represent application and database
var app = express();
var db;

//Define configuration of the other server
var config = {
	"USER"	: "",
	"PASS"	:"",
	"HOST"	:"ec2-54-252-128-85.ap-southeast-2.compute.amazonaws.com",
	"PORT"	:"27017",
	"DATABASE"	: "my_example"
};

//Define details for the databse we will be connecting to on that instance
var dbPath = "mongodb://"+config.USER + ":"+
	config.PASS + "@"+
	config.HOST + ":"+
	config.PORT + "/"+
	config.DATABASE;

var standardGreeting = 'Hello World!';

//Create something to store in our DB
var greetingSchema = mongoose.Schema({
	sentence: String
});
var Greeting = mongoose.model('Greeting', greetingSchema);

//Startup connection
db = mongoose.connect(dbPath);

//Check if database contains greeting
mongoose.connection.once('open', function() {
	var greeting;
	Greeting.find(function (err, greetings) {
		if( !greetings) {
			greeting = new Greeting({sentence: standardGreeting});
			greeting.save();
		}
	});
});

//Setup express routes to handle incoming requests
app.get('/', function(req, res) {
	Greeting.findOne(function (err, greeting) {
		res.send(greeting.sentence);
	});
});

//Setup express route to handle any errors
app.use(function(err, req, res, next) {
	if(req.xhr) {
		res.send(500, 'Something went wrong brotha');
	}
	else {
		next(err);
	}
});

//Finally start the express webserver
console.log('starting the Express (NodeJS) Web server');
app.listen(8080);
console.log('Webserver is listening on port 8080');