var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var LogSchema = new Schema({
  name: String,
  application: String,
  category: String,
  loggedDate :  { type:Date, default: Date.now }
 });
 
 module.exports = mongoose.model('LogModel', LogSchema)