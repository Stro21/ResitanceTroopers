var Usuario = require('../../models/usuario');
var TokenLog = require('../../models/tokenlog');
var validar = require("../../functions/validar");
var encriptar = require("../../functions/encriptar");
var jwt = require("jsonwebtoken");
var key = "keydetesteo";
var token;

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

// Verifies token on a request
exports.verify = function(token, callback) {
  return jwt.verify(
    token, // The token to be verified
    tokenSecret, // Same token we used to sign
    {}, // No Option, for more see https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
    callback //Pass errors or decoded token to callback
  );
};

//escuchando en puerto
exports.escuchando = function(port){
  console.log("Escuchando en: https://resistancetroopers.herokuapp.com/:" + port);
};

//ingresar nuevo usuario forma 1 (por parte o por elemento)
exports.ingresar_nuevo_usuario = function(req, res) {
  if(!req.body.usuario || !req.body.nombre || !req.body.apellidos || !req.body.contraseña || !req.body.edad || !req.body.nivel_militar || !req.body.habilitado_para_usar_app){
    return res.status(403).send({error: 'verifique los campos'}).end();
  }

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

// verify a token symmetric
jwt.verify(token, key, function(err, decoded) {
    //console.log(decoded) // bar
    return;
});

//obtener todos los usuarios
exports.obtener_usuarios = function(req, res){
  /*return jwt.verify(
    token, // The token to be verified
    tokenSecret, // Same token we used to sign
    {}, // No Option, for more see https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
    callback //Pass errors or decoded token to callback
  );*/


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
  if(!req.params.id){
    return res.status(403).send({error: 'verifique los campos'}).end();
  }

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
  if(!req.params.usuario){
    return res.status(403).send({error: 'verifique los campos'}).end();
  }

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
  if(!req.params.id){
    return res.status(403).send({error: 'verifique los campos'}).end();
  }

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
  if(!req.body.usuario || !req.body.nombre || !req.body.apellidos || !req.body.contraseña || !req.body.edad || !req.body.nivel_militar || !req.body.habilitado_para_usar_app){
    return res.status(403).send({error: 'verifique los campos'}).end();
  }

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

        token = jwt.sign(datos, key, {
          expiresIn: '24h' //expira en 24 horas tambien puedes ser 10d = 10 dias o 2 days = 2 dias
        });
        return res.status(200).send({ok: 'logeado con éxito', token: token}).end();
      }
    }

  });
};
