var Usuario = require('../../models/usuario');
var TokenLog = require('../../models/tokenlog');
var validar = require("../../functions/validar");
var encriptar = require("../../functions/encriptar");
var jwt = require("jsonwebtoken");
var key = "keydetesteo";

//login
exports.login = function(req, res){
  if(!req.body.usuario){
    return res.status(403).send({error: 'verifique los campos', user: req.params.usuario}).end();
  }

  Usuario.findOne({
    usuario: req.body.usuario.toLowerCase()
  }).exec(function(err, usuario){
    if(err){
      return res.status(403).send({error: 'no se pudo obtener el usuario', mensaje: err.message}).end();
    }

    if(!usuario){
      return res.status(404).send({error: 'usuario y/o contraseña no válidas'}).end();
    }

    if(usuario){
      if(encriptar.sha1(req.body.contraseña) != usuario.contraseña){
        return res.status(403).send({error: 'usuario y/o contraseña no válidas'}).end();
      }else{
        var datos = {
          usuario: req.body.usuario.toLowerCase(),
          contraseña: encriptar.sha1(req.body.contraseña)
        };

        var token = jwt.sign(datos, key, {
          expiresIn: '24h' //expira en 24 horas tambien puedes ser 10d = 10 dias o 2 days = 2 dias
        });
        return res.status(200).send({ok: 'logeado con éxito', token: token}).end();
      }
    }

  });
};
