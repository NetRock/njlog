var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var LogSchema = new Schema({
  title: String,
  appId: Schema.Types.ObjectId,
  category: String,
  message: String,
  loggedDate :  { type:Date, default: Date.now }
 });
 
 module.exports = mongoose.model('LogEntry', LogSchema);