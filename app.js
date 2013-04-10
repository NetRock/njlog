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
	appList.getApps(req, res);
});

app.get('/application/:domain/:name/:version', function(req, res){
	appList.getAppId(req, res);
});

app.post('/application', function(req, res){
	appList.registerApp(req, res);
});

app.delete('/application/:id', function(req, res){
	logList.deleteLogs(req, res);
	appList.deleteApp(req, res);
    res.send(200);
});

app.get('/log/:appId', function(req, res){
	logList.getLogs(req, res);
});

app.post('/log', function (req, res) {
	logList.addLog(req, res);
});

app.listen(port, function(){
  console.log("Express server listening on port " + port);
});