var Usuario = require('../models/usuario');
var TokenLog = require('../models/tokenlog');
var validar = require("../functions/validar");
var encriptar = require("../functions/encriptar");
var jwt = require("jsonwebtoken");
var key = "keydetesteo";

//login
exports.login = function(req, res){
  var datos = {
    usuario: req.body.usuario.toLowerCase()
  };

  Usuario.findOne({datos}).exec(function(err, usuario){
    if(err){
      return res.status(403).send({error: 'error al logear', mensaje: err.message}).end();
    }

    var token = jwt.sign(datos, key);
    return res.status(200).send({ok: 'logeado con éxito', token: token}).end();

    /*if(!usuario){
      return res.status(404).send({error: 'usuario no encontrado'}).end();
    }else if(usuario){
      if(encriptar.sha1(req.body.contraseña) != usuario.password){
        return res.status(403).send({error: 'usuario y/o contraseña no válidas', mensaje: err.message}).end();
      }else{
        var token = jwt.sign(datos, key);
        return res.status(200).send({ok: 'logeado con éxito', token: token}).end();
      }
    }*/
  });
};
