var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var batallon = new Schema({
    codigo: {type: String, required: true, trim: true, unique: true},
    nombre: {type: String, required: true, trim: true},
    nombre_capitan: {type: String, required: true, trim: true},
    latitud: {type: Number, required: true, trim: true},
    longitud: {type: Number, required: true, trim: true},
    cantidad_de_soldados_activos: {type: Number, required: true, trim: true}
});

module.exports = mongoose.model('Batallon', batallon);
