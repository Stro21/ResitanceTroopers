var jwt = require("jsonwebtoken");
var mongoose = require("mongoose");
//var db = "mongodb://ejemplo:xxeduhxx22@ds023064.mlab.com:23064/heroku_x76mjpd2";
var db = "mongodb://localhost/trooper";

mongoose.connect(db);

//mis archivos
var Usuario = require('../../models/usuario');
var TokenLog = require('../../models/tokenlog');
var Batallon = require('../../models/batallon');
var Ataque = require('../../models/ataque');
var validar = require("../../functions/validar");
var encriptar = require("../../functions/encriptar");
var generar = require("../../functions/generar");
var key = require("../../functions/key").key();

//pagina inicial
exports.main = function (req, res) {
    res.statusCode = 200;
    res.setHeader('Contente-Type', 'text/plain');
    return res.status(200).send({ok: 'Cargado con éxito'}).end();
};

//ingresar nuevo usuario
exports.ingresar_nuevo_usuario = function (req, res) {
    if (!req.body.usuario || !req.body.nombre || !req.body.apellidos || !req.body.contraseña || !req.body.edad || !req.body.nivel_militar || !req.body.habilitado_para_usar_app) {
        return res.status(400).send({error: 'verifique los campos'}).end();
    }

    var nuevo_usuario = new Usuario();
    nuevo_usuario.usuario = req.body.usuario.toLowerCase();
    nuevo_usuario.nombre = req.body.nombre.toLowerCase();
    nuevo_usuario.apellidos = req.body.apellidos.toLowerCase();
    nuevo_usuario.contraseña = encriptar.pbkdf2(req.body.contraseña);
    nuevo_usuario.edad = req.body.edad;
    nuevo_usuario.nivel_militar = req.body.nivel_militar.toLowerCase();
    nuevo_usuario.habilitado_para_usar_app = req.body.habilitado_para_usar_app;

    if (!validar.nivel_militar(nuevo_usuario.nivel_militar)) {
        res.status(400).send({error: 'nivel militar a ingresar no valido (soldado, oficial o capitán)'}).end();
    }

    nuevo_usuario.save(function (err, usuario) {
        if (err) {
            return res.status(500).send({error: 'no se pudo ingresar el usuario', mensaje: err.message}).end();
        } else if (!err) {
            return res.status(201).send({ok: 'usuario ingresado con éxito', usuario: usuario}).end();
        }
    });
};

//obtener todos los usuarios
exports.obtener_usuarios = function (req, res) {
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
exports.obtener_usuario_por_id = function (req, res) {
    if (!req.params.id) {
        return res.status(400).send({error: 'verifique los campos'}).end();
    }

    Usuario.findOne({
        _id: req.params.id
    }).exec(function (err, usuario) {
        if (err) {
            return res.status(500).send({error: 'no se pudo obtener el usuario', mensaje: err.message}).end();
        }

        if (!usuario || usuario.length === 0) {
            return res.status(404).send({error: 'no se encontró el usuario'}).end();
        } else if (usuarios) {
            return res.status(200).send({ok: 'usuario obtenido con éxito', usuario: usuario}).end();
        }
    });
};

//obtener usuario por cuenta
exports.obtener_usuario_por_cuenta = function (req, res) {
    if (!req.params.usuario) {
        return res.status(400).send({error: 'verifique los campos'}).end();
    }

    Usuario.findOne({
        usuario: req.params.usuario.toLowerCase()
    }).exec(function (err, usuario) {
        if (err) {
            return res.status(500).send({error: 'no se pudo obtener el usuario', mensaje: err.message}).end();
        }

        if (!usuario || usuario.length === 0) {
            return res.status(404).send({error: 'no se encontró el usuario'}).end();
        } else if (usuario) {
            return res.status(200).send({ok: 'usuario obtenido con éxito', usuario: usuario}).end();
        }
    });
};

//borrar todos los usuarios
exports.borrar_todos_los_usuarios = function (req, res) {
    Usuario.remove({}, function (err, usuarios) {
        if (err) {
            return res.status(500).send({error: 'no se pudieron borrar los usuarios', mensaje: err.message}).end();
        } else if (!err) {
            return res.status(200).send({ok: 'usuarios eliminados con éxito'}).end();
        }
    });
};

//borrar usuario por id
exports.borrar_usuario_por_id = function (req, res) {
    if (!req.params.id) {
        return res.status(400).send({error: 'verifique los campos'}).end();
    }

    Usuario.findOneAndRemove({
        _id: req.params.id
    }, function (err, usuario) {
        if (err) {
            return res.status(500).send({error: 'no se pudo borrar el usuario', mensaje: err.message}).end();
        }

        if (!usuario || usuario.length === 0) {
            return res.status(404).send({error: 'no se encontró el usuario'}).end();
        } else if (usuario) {
            return res.status(200).send({ok: 'usuario eliminado con éxito'}).end();
        }
    });
};

//modificar usuario por id
exports.modificar_usario_por_id = function (req, res) {
    if (!req.body.usuario || !req.body.nombre || !req.body.apellidos || !req.body.contraseña || !req.body.edad || !req.body.nivel_militar || !req.body.habilitado_para_usar_app) {
        return res.status(400).send({error: 'verifique los campos'}).end();
    }

    if (!validar.nivel_militar(req.body.nivel_militar)) {
        return res.status(400).send({error: 'nivel militar a modificar no valido (soldado, oficial o capitán)'}).end();
    }

    Usuario.findOneAndUpdate({_id: req.params.id},
            {$set:
                          {
                            usuario: req.body.usuario.toLowerCase(),
                            nombre: req.body.nombre.toLowerCase(),
                            apellidos: req.body.apellidos.toLowerCase(),
                            contraseña: encriptar.pbkdf2(req.body.contraseña),
                            edad: req.body.edad,
                            nivel_militar: req.body.nivel_militar.toLowerCase(),
                            habilitado_para_usar_app: req.body.habilitado_para_usar_app
                          }},
            {upsert: false}, function (err, usuario) {
        if (err) {
            return res.status(500).send({error: 'no se pudo modificar el usuario', mensaje: err.message}).end();
        }

        if (!usuario) {
            return res.status(404).send({error: 'no se encontró el usuario'}).end();
        } else if (usuario) {
            return res.status(201).send({ok: 'usuario modificado con éxito', usuario: usuario}).end();
        }
    });
};

//ingresar nuevo batallon
exports.ingresar_nuevo_batallon = function (req, res) {
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
exports.obtener_batallones = function (req, res) {
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
exports.modificar_batallon_por_id = function (req, res) {
    if (!req.body.nombre || !req.body.nombre_capitan || !req.body.latitud || !req.body.longitud || !req.body.cantidad_de_soldados_activos) {
        return res.status(400).send({error: 'verifique los campos'}).end();
    }

    Batallon.findOneAndUpdate({_id: req.params.id},
            {$set:
                          {
                            nombre: req.body.nombre.toLowerCase(),
                            nombre_capitan: req.body.nombre_capitan.toLowerCase(),
                            latitud: req.body.latitud,
                            longitud: req.body.longitud,
                            cantidad_de_soldados_activos: req.body.cantidad_de_soldados_activos
                          }},
            {upsert: false}, function (err, batallon) {
        if (err) {
            return res.status(500).send({error: 'no se pudo modificar el batallon', mensaje: err.message}).end();
        }

        if (!batallon) {
            return res.status(404).send({error: 'no se encontró el batallon'}).end();
        } else if (batallon) {
            return res.status(201).send({ok: 'batallon modificado con éxito', batallon: batallon}).end();
        }
    });
};

//borrar batallon por id
exports.borrar_batallon_por_id = function (req, res) {
    if (!req.params.id) {
        return res.status(400).send({error: 'verifique los campos'}).end();
    }

    Batallon.findOneAndRemove({
        _id: req.params.id
    }, function (err, batallon) {
        if (err) {
            return res.status(500).send({error: 'no se pudo borrar el batallon', mensaje: err.message}).end();
        }

        if (!batallon || batallon.length === 0) {
            return res.status(404).send({error: 'no se encontró el batallon'}).end();
        } else if (batallon) {
            return res.status(200).send({ok: 'batallon eliminado con éxito'}).end();
        }
    });
};

//obtener batallon por id
exports.obtener_batallon_por_id = function (req, res) {
    if (!req.params.id) {
        return res.status(400).send({error: 'verifique los campos'}).end();
    }

    Batallon.findOne({
        _id: req.params.id
    }).exec(function (err, batallon) {
        if (err) {
            return res.status(500).send({error: 'no se pudo obtener el batallon', mensaje: err.message}).end();
        }

        if (!batallon || batallon.length === 0) {
            return res.status(404).send({error: 'no se encontró el batallon'}).end();
        } else if (batallon) {
            return res.status(200).send({ok: 'batallon obtenido con éxito', batallon: batallon}).end();
        }
    });
};

//ingresar nuevo ataque
exports.atacar_a_batallon_por_id = function (req, res) {
    if (!req.body.id_batallon_atacado || !req.body.id_batallon_atacante) {
        return res.status(400).send({error: 'verifique los campos'}).end();
    }

    var probabilidad = generar.generar_random(1, 100);

    var nuevo_ataque = new Ataque();
    nuevo_ataque.id_batallon_atacado = req.body.id_batallon_atacado;
    nuevo_ataque.id_batallon_atacante = req.body.id_batallon_atacante;
    nuevo_ataque.probabilidad_de_exito = probabilidad;

    nuevo_ataque.save(function (err, ataque) {
        if (err) {
            return res.status(500).send({error: 'no se pudo atacar al batallon', mensaje: err.message}).end();
        } else if (!err) {
            return res.status(201).send({ok: 'batallon atacado con éxito', ataque: ataque}).end();
        }
    });
};

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
