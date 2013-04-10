var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var LogSchema = new Schema({
  name: String,
  appId: String,
  category: String,
  message: String,
  loggedDate :  { type:Date, default: Date.now }
 });
 
 module.exports = mongoose.model('LogEntry', LogSchema);