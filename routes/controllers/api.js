var jwt = require("jsonwebtoken");
var mongoose = require("mongoose");
//var db = "mongodb://ejemplo:xxeduhxx22@ds023064.mlab.com:23064/heroku_x76mjpd2";
var db = "mongodb://localhost/trooper";
var rango = 100;
var criterio = 80;

mongoose.connect(db);

//mis archivos
var Usuario = require('../../models/usuario');
var TokenLog = require('../../models/tokenlog');
var Batallon = require('../../models/batallon');
var AtaqueDirecto = require('../../models/ataque_directo');
var validar = require("../../functions/validar");
var funciones = require("../../functions/funciones");
var encriptar = require("../../functions/encriptar");
var generar = require("../../functions/generar");
var key = require("../../functions/key").key();
var niveles_militares = validar.obtener_niveles_militares();

//pagina inicial
exports.main = function (req, res) {
    res.statusCode = 200;
    res.setHeader('Contente-Type', 'text/plain');
    return res.status(200).send({ok: 'Cargado con éxito...'}).end();
};

/*USUARIOS*/
//ingresar nuevo usuario
exports.ingresarNuevoUsuario = function (req, res) {
    if (!req.body.usuario || !req.body.nombre || !req.body.apellidos || !req.body.contraseña || !req.body.edad || !req.body.nivel_militar || !req.body.habilitado_para_usar_app) {
        return res.status(400).send({error: 'verifique los campos'}).end();
    }

    if (req.body.nivel_militar && !validar.nivel_militar(req.body.nivel_militar)) {
      return res.status(400).send({error: 'nivel militar a ingresar no valido, los niveles disponibles son:', niveles_militares: niveles_militares}).end();
    }

    var nuevo_usuario = new Usuario();
    nuevo_usuario.usuario = req.body.usuario.toLowerCase();
    nuevo_usuario.nombre = req.body.nombre.toLowerCase();
    nuevo_usuario.apellidos = req.body.apellidos.toLowerCase();
    nuevo_usuario.contraseña = encriptar.pbkdf2(req.body.contraseña);
    nuevo_usuario.edad = req.body.edad;
    nuevo_usuario.nivel_militar = req.body.nivel_militar.toLowerCase();
    nuevo_usuario.habilitado_para_usar_app = req.body.habilitado_para_usar_app;

    nuevo_usuario.save(function (err, usuario) {
        if (err) {
            return res.status(500).send({error: 'no se pudo ingresar el usuario', mensaje: err.message}).end();
        } else if (!err) {
            return res.status(201).send({ok: 'usuario ingresado con éxito', usuario: usuario}).end();
        }
    });
};

//obtener todos los usuarios
exports.obtenerUsuarios = function (req, res) {
    Usuario.find({}).exec(function (err, usuarios) {
        if (err) {
            return res.status(500).send({error: 'no se pudieron obtener los usuarios', mensaje: err.message}).end();
        }

        if (!usuarios || usuarios.length === 0) {
            return res.status(404).send({error: 'no hay usuarios para mostrar'}).end();
        } else if (usuarios) {
            return res.status(200).send({ok: 'usuarios obtenidos con éxito', usuarios: usuarios}).end();
        }
    });
};

//obtener usuario por id
exports.obtenerUsuarioPorId = function (req, res) {
    if (!req.params.id) {
        return res.status(400).send({error: 'verifique los campos'}).end();
    }

    Usuario.findOne({
        _id: req.params.id
    }).exec(function (err, usuario) {
        if (err) {
            return res.status(500).send({error: 'no se pudo obtener el usuario', mensaje: err.message}).end();
        }

        if (!usuario) {
            return res.status(404).send({error: 'no se encontró el usuario'}).end();
        } else if (usuario) {
            return res.status(200).send({ok: 'usuario obtenido con éxito', usuario: usuario}).end();
        }
    });
};

//borrar todos los usuarios
exports.borrarTodosLosUsuarios = function (req, res) {
    Usuario.remove({}, function (err, usuarios) {
        if (err) {
            return res.status(500).send({error: 'no se pudieron borrar los usuarios', mensaje: err.message}).end();
        } else if (!err) {
            return res.status(200).send({ok: 'usuarios eliminados con éxito'}).end();
        }
    });
};

//borrar usuario por id
exports.borrarUsuarioPorId = function (req, res) {
    if (!req.params.id) {
        return res.status(400).send({error: 'verifique los campos'}).end();
    }

    Usuario.findOneAndRemove({
        _id: req.params.id
    }, function (err, usuario) {
        if (err) {
            return res.status(500).send({error: 'no se pudo borrar el usuario', mensaje: err.message}).end();
        }

        if (!usuario) {
            return res.status(404).send({error: 'no se encontró el usuario'}).end();
        } else if (usuario) {
            return res.status(200).send({ok: 'usuario eliminado con éxito'}).end();
        }
    });
};

//modificar usuario por id
exports.modificarUsuarioPorId = function (req, res) {
    if (req.body.nivel_militar && !validar.nivel_militar(req.body.nivel_militar)) {
      return res.status(400).send({error: 'nivel militar a ingresar no valido, los niveles disponibles son:', niveles_militares: niveles_militares}).end();
    }

    Usuario.findOne({
        _id: req.params.id
    }).exec(function (err, usuario) {
        if (err) {
            return res.status(500).send({error: 'no se pudo modificar el usuario', mensaje: err.message}).end();
        }

        if (!usuario) {
            return res.status(404).send({error: 'no se encontró el usuario'}).end();
        } else if (usuario) {

          var actual_usuario = {
            usuario: !req.body.usuario ? usuario.usuario : req.body.usuario.toLowerCase(),
            nombre: !req.body.nombre ? usuario.nombre : req.body.nombre.toLowerCase(),
            apellidos: !req.body.apellidos ? usuario.apellidos : req.body.apellidos.toLowerCase(),
            contraseña: !req.body.contraseña ? usuario.contraseña  : encriptar.pbkdf2(req.body.contraseña),
            edad: !req.body.edad ? usuario.edad : req.body.edad,
            nivel_militar: !req.body.nivel_militar ? usuario.nivel_militar : req.body.nivel_militar.toLowerCase(),
            habilitado_para_usar_app: !req.body.habilitado_para_usar_app ? usuario.habilitado_para_usar_app : req.body.habilitado_para_usar_app
          }

          Usuario.findOneAndUpdate({_id: req.params.id},
          {$set: actual_usuario},
            {upsert: false}, function (err, usuario) {
              if (err) {
                return res.status(500).send({error: 'no se pudo modificar el usuario', mensaje: err.message}).end();
              }

              if (!usuario) {
                return res.status(404).send({error: 'no se encontró el usuario'}).end();
              } else if (usuario) {
                return res.status(201).send({ok: 'usuario modificado con éxito', usuario: actual_usuario}).end();
              }
            });
        }
    });
};

/*BATALLONES*/
//ingresar nuevo batallon
exports.ingresarNuevoBatallon = function (req, res) {
    if (!req.body.nombre || !req.body.nombre_capitan || !req.body.latitud || !req.body.longitud || !req.body.cantidad_de_soldados_activos) {
        return res.status(400).send({error: 'verifique los campos'}).end();
    }

    var nuevo_batallon = new Batallon();
    nuevo_batallon.nombre = req.body.nombre.toLowerCase();
    nuevo_batallon.nombre_capitan = req.body.nombre_capitan.toLowerCase();
    nuevo_batallon.latitud = req.body.latitud;
    nuevo_batallon.longitud = req.body.longitud;
    nuevo_batallon.cantidad_de_soldados_activos = req.body.cantidad_de_soldados_activos;

    nuevo_batallon.save(function (err, usuario) {
        if (err) {
            return res.status(500).send({error: 'no se pudo ingresar el batallon', mensaje: err.message}).end();
        } else if (!err) {
            return res.status(201).send({ok: 'batallon ingresado con éxito', usuario: usuario}).end();
        }
    });
};

//obtener todos los batallones
exports.obtenerBatallones = function (req, res) {
    Batallon.find({}).exec(function (err, batallones) {
        if (err) {
            return res.status(500).send({error: 'no se pudieron obtener los batallones', mensaje: err.message}).end();
        }

        if (!batallones || batallones.length === 0) {
            return res.status(404).send({error: 'no hay batallones para mostrar'}).end();
        } else if (batallones) {
            return res.status(200).send({ok: 'batallones obtenidos con éxito', batallones: batallones}).end();
        }
    });
};

//modificar batallon por id
exports.modificarBatallonPorId = function (req, res) {
    Batallon.findOne({
        _id: req.params.id
    }).exec(function (err, batallon) {
        if (err) {
            return res.status(500).send({error: 'no se pudo modificar el batallon', mensaje: err.message}).end();
        }

        if (!batallon) {
            return res.status(404).send({error: 'no se encontró el batallon'}).end();
        } else if (batallon) {

              var actual_batallon = {
                nombre: !req.body.nombre ? batallon.nombre : req.body.nombre.toLowerCase(),
                nombre_capitan: !req.body.nombre_capitan ? batallon.nombre_capitan : req.body.nombre_capitan.toLowerCase(),
                latitud: !req.body.latitud ? batallon.latitud : req.body.latitud,
                longitud: !req.body.longitud ? batallon.longitud : req.body.longitud,
                cantidad_de_soldados_activos: !req.body.cantidad_de_soldados_activos ? batallon.cantidad_de_soldados_activos :  req.body.cantidad_de_soldados_activos
              }

              Batallon.findOneAndUpdate({_id: req.params.id},
                      {$set: actual_batallon},
                      {upsert: false}, function (err, batallon) {
                  if (err) {
                      return res.status(500).send({error: 'no se pudo modificar el batallon', mensaje: err.message}).end();
                  }

                  if (!batallon) {
                      return res.status(404).send({error: 'no se encontró el batallon'}).end();
                  } else if (batallon) {
                      return res.status(201).send({ok: 'batallon modificado con éxito', batallon: actual_batallon}).end();
                  }
              });
        }
    });
};

//borrar todos los batallones
exports.borrarTodosLosBatallones = function (req, res) {
    Batallon.remove({}, function (err, usuarios) {
        if (err) {
            return res.status(500).send({error: 'no se pudieron borrar los batallones', mensaje: err.message}).end();
        } else if (!err) {
            return res.status(200).send({ok: 'batallones eliminados con éxito'}).end();
        }
    });
};

//borrar batallon por id
exports.borrarBatallonPorId = function (req, res) {
    if (!req.params.id) {
        return res.status(400).send({error: 'verifique los campos'}).end();
    }

    Batallon.findOneAndRemove({
        _id: req.params.id
    }, function (err, batallon) {
        if (err) {
            return res.status(500).send({error: 'no se pudo borrar el batallon', mensaje: err.message}).end();
        }

        if (!batallon) {
            return res.status(404).send({error: 'no se encontró el batallon'}).end();
        } else if (batallon) {
            return res.status(200).send({ok: 'batallon eliminado con éxito'}).end();
        }
    });
};

//obtener batallon por id
exports.obtenerBatallonPorId = function (req, res) {
    if (!req.params.id) {
        return res.status(400).send({error: 'verifique los campos'}).end();
    }

    Batallon.findOne({
        _id: req.params.id
    }).exec(function (err, batallon) {
        if (err) {
            return res.status(500).send({error: 'no se pudo obtener el batallon', mensaje: err.message}).end();
        }

        if (!batallon) {
            return res.status(404).send({error: 'no se encontró el batallon'}).end();
        } else if (batallon) {
            return res.status(200).send({ok: 'batallon obtenido con éxito', batallon: batallon}).end();
        }
    });
};

/*ATAQUES*/
//ingresar nuevo ataque por id
exports.atacarBatallonPorId = function (req, res) {
    if (!req.params.id) {
      return res.status(400).send({error: 'verifique los campos'}).end();
    }

    Batallon.findOne({
      _id: req.params.id
    }).exec(function (err, batallon) {
        if (err) {
            return res.status(500).send({error: 'no se pudo obtener el batallon', mensaje: err.message}).end();
        }

        if (!batallon) {
            return res.status(404).send({error: 'no se encontro el batallon'}).end();
        } else if (batallon) {

              var criterio_mensaje = "que la probabilidad sea mayor o igual a un " + criterio + "%";
              var probabilidad = generar.generar_random(1, 100);
              var exitoso = false;
              if(probabilidad >= criterio){
                exitoso = true;
              }

              var nuevo_ataque = new AtaqueDirecto();
              nuevo_ataque.probabilidad = probabilidad;
              nuevo_ataque.ataque_exitoso = exitoso;
              nuevo_ataque.criterio = criterio_mensaje;
              nuevo_ataque.id_escuadron_atacado = req.params.id;

              nuevo_ataque.save(function (err, ataque) {
                  if (err) {
                      return res.status(500).send({error: 'no se pudo atacar al batallon', mensaje: err}).end();
                  } else if (!err) {
                      return res.status(201).send({ok: 'batallon atacado', ataque: ataque}).end();
                  }
              });
        }
    });
};

//obtener todos los ataques
exports.obtenerAtaques = function (req, res) {
    AtaqueDirecto.find({}).exec(function (err, ataques) {
        if (err) {
            return res.status(500).send({error: 'no se pudieron obtener los ataques', mensaje: err.message}).end();
        }

        if (!ataques || ataques.length === 0) {
            return res.status(404).send({error: 'no hay ataques para mostrar'}).end();
        } else if (ataques) {
            return res.status(200).send({ok: 'ataques obtenidos con éxito', ataques: ataques}).end();
        }
    });
};

//borrar todos los ataques
exports.borrarTodosLosAtaques = function (req, res) {
    AtaqueDirecto.remove({}, function (err, usuarios) {
        if (err) {
            return res.status(500).send({error: 'no se pudieron borrar los ataques', mensaje: err.message}).end();
        } else if (!err) {
            return res.status(200).send({ok: 'ataques eliminados con éxito'}).end();
        }
    });
};

/*OBJETIVOS*/
//buscar batallon cercano a un punto
exports.consultarPunto = function (req, res) {
    if (!req.body.longitud || !req.body.latitud) {
        return res.status(400).send({error: 'verifique los campos'}).end();
    }

    Batallon.find().exec(function (err, batallones) {
        if (err) {
          return res.status(500).send({error: 'no se pudieron encontrar los batallones cercanos', mensaje: err.message}).end();
        }

        if (!batallones || batallones.length === 0) {
          return res.status(404).send({error: 'no hay batallones cercanos a menos de ' + rango + ' metros+ para mostrar'}).end();
        } else if (batallones && batallones.length !== 0) {

          var menor = batallones[0];
          var euclidana_menor = funciones.euclidana(batallones[0].latitud, batallones[0].longitud, req.body.latitud, req.body.longitud);
          var euclidana_actual;

          for(var i = 1; i < batallones.length; i++){
            euclidana_actual = funciones.euclidana(batallones[i].latitud, batallones[i].longitud, req.body.latitud, req.body.longitud);

            if(euclidana_actual < euclidana_menor){
              menor = batallones[i];
            }
          }

          return res.status(200).send({error: 'batallon cercano encontrado con éxito', batallon: menor}).end();
        }
    });
};

/*LOGIN*/
//validar token
exports.validar_token = function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).send({error: 'no autenticado'}).end();
  }
}

//login
exports.login = function (req, res) {
    if (!req.body.usuario || !req.body.contraseña) {
        return res.status(400).send({error: 'verifique los campos'}).end();
    }

    Usuario.findOne({
        usuario: req.body.usuario.toLowerCase()
    }).exec(function (err, usuario) {
        if (err) {
            return res.status(500).send({error: 'no se pudo obtener el usuario', mensaje: err.message}).end();
        }

        if (!usuario) {
            return res.status(404).send({error: 'usuario y/o contraseña no válidas'}).end();
        }

        if (usuario) {
            if (encriptar.pbkdf2(req.body.contraseña) != usuario.contraseña) {
                return res.status(404).send({error: 'usuario y/o contraseña no válidas'}).end();
            } else {
                var datos = {
                    usuario: req.body.usuario.toLowerCase(),
                    contraseña: encriptar.pbkdf2(req.body.contraseña)
                };

                token = jwt.sign(datos, key, {
                    expiresIn: '24h' //expira en 24 horas tambien puedes ser 10d = 10 dias o 2 days = 2 dias
                });
                return res.status(200).send({ok: 'logeado con éxito', token: token}).end();
            }
        }

    });
};
