var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var trooperDataSchema = new Schema({
  user: {type: String, required: true, trim: true, unique: true},
  nombre: {type: String, required: true, trim: true},
  apellidos: {type: String, required: true, trim: true},
  password: {type: String, required: true, trim: true},
  edad: {type: Number, required: true, trim: true},
  nivelmilitar: {type: String, required: true, trim: true},
  habilitado_para_usar_app: {type: Boolean, required: true, trim: true}
});

module.exports = mongoose.model('TrooperData', trooperDataSchema);
