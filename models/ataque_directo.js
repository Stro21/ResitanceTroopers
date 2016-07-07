var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ataqueDirecto = new Schema({
    probabilidad: {type: Number, required: true, trim: true},
    ataque_exitoso: {type: Boolean, required: true, trim: true},
    criterio: {type: String, required: true, trim: true},
    id_escuadron: {type: String, required: true, trim: true}
});

module.exports = mongoose.model('ataqueDirecto', ataqueDirecto);
