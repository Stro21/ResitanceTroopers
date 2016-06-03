var Usuario = require('../models/usuario');
var TokenLog = require('../models/tokenlog');
var validar = require("../functions/validar");
var encriptar = require("../functions/encriptar");

//pagina inicial
exports.main = function(req, res){
  var indice = [
    "<html>",
    "<p>GET /usuarios = para mostrar todos los usuarios</p>",
    "<p>GET /usuarios/id_del_usuario = para mostrar la info del usuario por id<br></p>",
    "<p>POST /ingresar = pasar: user, nombre, apellidos, password, nivelmilitar, habilitado_para_usar_app<br></p>",
    "<p>POST /ingresar2 = pasar: user, nombre, apellidos, password, nivelmilitar, habilitado_para_usar_app (se envia el mismo json, pero se trabaja diferente)</p>",
    "<p>PUT /usuarios/id_del_usuario = pasar: user, nombre, apellidos, password, nivelmilitar, habilitado_para_usar_app</p>",
    "<p>DELETE /usuarios/id_del_usuario = para borrar un usuario por id</p>",
    "<p>DELETE /vaciar = para borrar a todos los usuarios</p>",
    "<p>GET /usuarios/cuenta/cuenta_del_usuario = para mostrar la info del usuario por cuenta</p>",
    "</html>"
  ];

res.setHeader('Contente-Type','text/html');
  res.status(200).send(indice).end();
};

//escuchando en puerto
exports.escuchando = function(port){
  console.log("Escuchando en: http://localhost:" + port);
};

//ingresar nuevo usuario forma 1 (por parte o por elemento)
exports.ingresar_nuevo_usuario = function(req, res) {
  var nuevo_usuario = new Usuario();
  nuevo_usuario.usuario = req.body.usuario.toLowerCase();
  nuevo_usuario.nombre = req.body.nombre.toLowerCase();
  nuevo_usuario.apellidos = req.body.apellidos.toLowerCase();
  nuevo_usuario.contraseña = encriptar.sha1(req.body.contraseña);
  nuevo_usuario.edad = req.body.edad;
  nuevo_usuario.nivel_militar = req.body.nivel_militar.toLowerCase();
  nuevo_usuario.habilitado_para_usar_app = req.body.habilitado_para_usar_app;

  if(!validar.nivel_militar(nuevo_usuario.nivel_militar)){
      res.status(403).send({error: 'nivel militar a ingresar no valido'}).end();
  }

  nuevo_usuario.save(function(err, usuario){
    if(err){
      return res.status(403).send({error: 'no se pudo ingresar el usuario', mensaje: err.message}).end();
    }

    return res.status(200).send({ok: 'usuario ingresado con éxito', usuario: usuario}).end();
    });
};

//obtener todos los usuarios
exports.obtener_usuarios = function(req, res){
  Usuario.find({}).exec(function(err, usuarios){
    if(err){
      return res.status(403).send({error: 'no se pudieron obtener los usuarios', mensaje: err.message}).end();
    }

    if(usuarios.length === 0){
      return res.status(404).send({error: 'no hay usuarios para mostrar'}).end();
    }

    return res.status(200).send({ok: 'usuarios obtenidos con éxito', usuarios: usuarios}).end();
  });
};

//obtener usuario por id
exports.obtener_usuario_por_id = function(req, res){
  Usuario.findOne({
    _id: req.params.id
  }).exec(function(err, usuario){
    if(err){
      return res.status(403).send({error: 'no se pudo obtener el usuario', mensaje: err.message}).end();
    }

    return res.status(200).send({ok: 'usuario obtenido con éxito', usuario: usuario}).end();
  });
};

//obtener usuario por cuenta
exports.obtener_usuario_por_cuenta = function(req, res){
  Usuario.findOne({
    usuario: req.params.usuario.toLowerCase()
  }).exec(function(err, usuario){
    if(err){
      return res.status(403).send({error: 'no se pudo obtener el usuario', mensaje: err.message}).end();
    }

    if(!usuario){
      return res.status(404).send({error: 'no se encontró el usuario ' + req.params.usuario.toLowerCase()}).end();
    }

    return res.status(200).send({ok: 'usuario obtenido con éxito', usuario: usuario}).end();
  });
};

//borrar todos los usuarios
exports.borrar_todos_los_usuarios = function(req, res){
  Usuario.remove({}, function(err, usuarios){
    if(err){
      return res.status(403).send({error: 'no se pudieron borrar los usuarios', mensaje: err.message}).end();
    }

    return res.status(200).send({ok: 'usuarios borrados con éxito', usuarios: usuarios}).end();
    });
};

//borrar usuario por id
exports.borrar_usuario_por_id = function(req, res){
 Usuario.findOneAndRemove({
   _id: req.params.id
 }, function(err, usuario){
   if(err){
     return res.status(403).send({error: 'no se pudo borrar el usuario', mensaje: err.message}).end();
   }

   return res.status(200).send({ok: 'usuario borrado con éxito', usuario: usuario}).end();
 });
};

//modificar usuario por id
exports.modificar_usario_por_id = function(req, res){
  if(!validar.nivel_militar(req.body.nivel_militar)){
      return res.status(403).send({error: 'nivel militar a modificar no valido'}).end();
  }

  Usuario.findOneAndUpdate({_id: req.params.id},
    {$set:
      {
        usuario: req.body.usuario.toLowerCase(),
        nombre: req.body.nombre.toLowerCase(),
        apellidos: req.body.apellidos.toLowerCase(),
        contraseña: encriptar.sha1(req.body.contraseña),
        edad: req.body.edad,
        nivel_militar: req.body.nivel_militar.toLowerCase(),
        habilitado_para_usar_app: req.body.habilitado_para_usar_app
      }},
  {upsert: true}, function(err, usuario){
    if(err){
      return res.status(403).send({error: 'no se pudo modificar el usuario', mensaje: err.message}).end();
    }

    return res.status(200).send({ok: 'usuario modificado con éxito', usuario: usuario}).end();
    });
};
