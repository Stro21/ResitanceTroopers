var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var tokenLog = new Schema({
    token: {type: String, required: true, trim: true, unique: true},
    fecha_creacion: {type: Date, required: true, default: Date.now, trim: true}
});

module.exports = mongoose.model('TokenLog', tokenLog);
