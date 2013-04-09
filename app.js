var http = require('http')
var express = require('express');
var mongoose = require('mongoose');

var app = express();
mongoose.connect('mongodb://MongoLab-a4:KX_CVZRYhr_OPO__Uo2A4kkNUhjttC2lQT6bGNQ59kw-@ds041157.mongolab.com:41157/MongoLab-a4');


var LogList = require('./models/loglist');
var logList = new LogList();

var AppList = require('./models/applist');
var appList = new AppList();

var port = process.env.PORT || 1337;

app.configure(function(){
	app.set('port', port);
	app.use(express.bodyParser());
	app.use(app.router);
});

app.get('/application', function(req, res){

});

app.post('/application', function(req, res){

});

app.delete('/application/:id', function(req, res){

});

app.get('/', function(req, res){
	logList.showLogs(req, res);
});

app.post('/addLog', function (req, res) {
	logList.addLog(req, res);
});

app.listen(port, function(){
  console.log("Express server listening on port " + port);
});