var mongoose = require('mongoose'),
  log = require('./log.js');
  
module.exports = LogList;

function LogList(){
}

LogList.prototype = {
  showLogs: function(req, res){
    log.find(function foundLogs(err, items){
      res.json({title: 'All Log List ', tasks: items});
    });
  },
  
  addLog: function(req, res){
    var item = req.body;
    var newLog = new log();
    newLog.name = item.name;
    newLog.application = item.application;
    newLog.category = item.category;
    newLog.save(function saveLog(err){
      if(err){
        throw err;
      }
    });

    res.send(200);
  }
}