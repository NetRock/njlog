var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ApplicationSchema = new Schema({
	domain: String,
	name: String,
	version: String
});

module.exports = mongoose.model("AppModel", ApplicationSchema);