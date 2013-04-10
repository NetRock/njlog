var Log = require('./log.js');
  
module.exports = LogList;

function LogList(){
}

LogList.prototype = {
  getLogs: function(req, res){
    console.log(req.params.appId);
    Log.find({appId: req.params.appId}, function(err, items){
      res.json(items);
    });
  },
  
  addLog: function(req, res){
    var item = req.body;
    var newLog = new Log();
    newLog.name = item.name;
    newLog.appId = item.appId;
    newLog.category = item.category;
    newLog.message = item.message;
    console.log(newLog);
    newLog.save(function saveLog(err){
      if(err){
        throw err;
      }
    });

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