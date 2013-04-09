var application = require('./application.js');

module.exports = AppList;

function AppList(){
}

AppList.prototype = {
	getApps: function(req, res){
		application.find(function foundApps(err, items){
			res.json(items);
		});
	},

	registerApp: function(req, res){
		var app = req.body;
		var newApp = new application();
		newApp.domain = app.domain;
		newApp.name = app.name;
		newApp.version = app.version;
		newApp.save(function(err){
			if(err){
				throw err;
			}
		});

		res.send(200, {appId: newApp._id});
	},

	deleteApp: function(req, res){

	}
}