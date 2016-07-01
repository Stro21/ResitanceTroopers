var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ataque = new Schema({
    longitud_ataque: {type: Number, required: true, trim: true},
    latitud_ataque: {type: Number, required: true, trim: true},
    probabilidad: {type: Number, required: true, trim: true},
    ataque_exitoso: {type: Boolean, required: true, trim: true},
    criterio: {type: String, required: true, trim: true},
    escuadrones_atacados: [{
      nombre: {type: String, trim: true, unique: true},
      nombre_capitan: {type: String, trim: true},
      latitud: {type: Number, trim: true},
      longitud: {type: Number, trim: true},
      cantidad_de_soldados_activos: {type: Number, trim: true}
    }]
});

module.exports = mongoose.model('Ataque', ataque);
