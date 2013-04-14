var Application = require('./application.js');

module.exports = AppList;

function AppList(){
}

AppList.prototype = {
	getApps: function(req, res){
		Application.find(function(err, items){
			res.json(items);
		});
	},

	getAppId: function(req, res){
		Application.find({domain: req.params.domain, name: req.params.name, version: req.params.version},
			function(err, items){
				if(err){
					throw err;
				}
				
				if(items.length == 0)
				{
					var newApp = this.createApp(req.params);
					res.send(200, newApp._id);
				}
				else
				{
					res.send(200, items[0]._id);
				}
			}
		);
	},

	createApp: function(app){
		var newApp = new Application();
		newApp.domain = app.domain;
		newApp.name = app.name;
		newApp.version = app.version;
		newApp.save(function(err){
			if(err){
				throw err;
			}
		return newApp;
		});
	},

	registerApp: function(req, res){
		var app = req.body;
		var newApp = this.createApp(app);

		res.send(200, {appId: newApp._id});
	},

	deleteApp: function(req, res){
		Application.remove({_id: req.params.id}, function(err){
			if(err){
				throw err;
			}
		});
	}
}