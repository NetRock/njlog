var Log = require('./log.js');
  
module.exports = LogList;

function LogList(){
}

LogList.prototype = {
  getLogs: function(req, res){
//    Log.find({appId: req.params.appId}, function(err, items){
//      res.json(items);
//    });
    var query = Log.find({appId: req.params.appId});
    if(req.params.category != undefined)
    {
      query = query.where('category').equals(req.params.category);
    }
    query.sort('-loggedDate').limit(100).exec(function(err, items){
      res.json(items);
    })
  },
  
  addLog: function(req, res){
    var items = req.body;
    for(var i = 0; i < items.length; i++){
      var newLog = new Log();
      newLog.title = items[i].title;
      newLog.appId = items[i].appId;
      newLog.category = items[i].category;
      newLog.message = items[i].message;
      newLog.save(function saveLog(err){
        if(err){
          throw err;
        }
      });
    }

    res.send(200);
  },

  deleteLogs: function(req, res){
    Log.remove({appId: req.params.id}, function(err){
      if(err){
        throw err;
      }
    });
  }
}