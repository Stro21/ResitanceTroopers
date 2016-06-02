var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tokenLog = new Schema({
  token: {type: String, required: true, trim: true, unique: true},
  date_created: {type: date, required: true, default: date.now, trim: true}
});

module.exports = mongoose.model('TokenLog', tokenLog);
