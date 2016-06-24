var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ataque = new Schema({
    id_batallon_atacado: {type: String, required: true, trim: true},
    id_batallon_atacante: {type: String, required: true, trim: true},
    probabilidad_de_exito: {type: Number, required: true, trim: true}
});

module.exports = mongoose.model('Ataque', ataque);
