var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var batallon = new Schema({
    nombre: {type: String, trim: true, unique: true},
    nombre_capitan: {type: String, trim: true},
    latitud: {type: Number, trim: true},
    longitud: {type: Number, trim: true},
    cantidad_de_soldados_activos: {type: Number, trim: true}
});

module.exports = mongoose.model('Batallon', batallon);
