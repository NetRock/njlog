var mongoose = require('mongoose'),
  log = require('../models/log.js');
  
module.exports = LogList;

function LogList(connection){
  mongoose.connect(connection);
}

LogList.prototype = {
  showLogs: function(req, res){
    log.find(null, function foundLogs(err, items){
      res.render('index', {title: 'All Log List ', tasks: items})
    });
  },
  
  addLog: function(req, res){
    var item = req.body.item;
    newLog = new log();
    newLog.name = item.name;
    newLog.application = item.application;
    newLog.category = item.category;
    newLog.save(function saveLog(err){
      if(err){
        throw err;
      }
    });
    res.redirect('/');
  }
}