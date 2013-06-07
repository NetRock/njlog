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
		var self = this;
		Application.find({domain: req.params.domain, name: req.params.name, version: req.params.version},
			function(err, items){
				if(err){
					throw err;
				}
				
				if(items.length == 0)
				{
					self.createApp(req.params, res);
				}
				else
				{
					res.send(200, {appId: items[0]._id});
				}
			}
		);
	},

	createApp: function(app, res){
		var newApp = new Application();
		newApp.domain = app.domain;
		newApp.name = app.name;
		newApp.version = app.version;
		newApp.save(function(err){
			if(err){
				throw err;
			}
			else{
				res.send(200, {appId: newApp._id});
			}
		});
	},

	registerApp: function(req, res){
		var app = req.body;
		this.createApp(app, res);
	},

	deleteApp: function(req, res){
		Application.remove({_id: req.params.id}, function(err){
			if(err){
				throw err;
			}
		});
	}
}