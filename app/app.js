var express = require("express");
var app = express();
var http = require("http");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var encriptar = require("../functions/encriptar");
encriptar = new encriptar();
var validar = require("../functions/validar");
validar = new validar();
var trooperDataSchema = require("../models/model.usuario");
var server = http.createServer(handleRequestTextPlain);
var db = "mongodb://localhost/ejemplo";
var port = 8000;

mongoose.connect(db);

//usar bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

//guia de opciones
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

//pagina inicial
app.get("/", function(req, res){
  res.setHeader('Contente-Type','text/html');
  res.status(200).send(indice).end();
});

//escuchando en puerto
app.listen(port, function(){
  console.log("Escuchando en: http://localhost:" + port);
});

//login
/*app.post("/login", function(req, res){
  trooperDataSchema.findOne({
    user: req.params.user.toLowerCase(),
    password: encriptar.sha1(req.params.user.toLowerCase())
  }).exec(function(err, usuario){
    if(err){
      res.send(err.message);
      res.status(403).send({error: 'usuario o contraseña incorrecta', mensaje: err.message}).end();
    }else{
      res.status(200).send({ok: 'usuario logeado con éxito', usuario: usuario}).end();
    }
  });
});*/

//obtener todos los usuarios
app.get("/usuarios", function(req, res){
  trooperDataSchema.find({}).exec(function(err, usuarios){
    if(err){
      res.send(err.message);
      res.status(403).send({error: 'no se pudieron obtener los usuarios', mensaje: err.message}).end();
    }else{
      res.status(200).send({ok: 'usuarios obtenidos con éxito', usuarios: usuarios}).end();
    }
  });
});

//obtener usuario por id
app.get("/usuarios/:id", function(req, res){
  trooperDataSchema.findOne({
    _id: req.params.id
  }).exec(function(err, usuario){
    if(err){
      res.send(err.message);
      res.status(403).send({error: 'no se pudo obtener el usuario', mensaje: err.message}).end();
    }else{
      res.status(200).send({ok: 'usuario obtenido con éxito', usuario: usuario}).end();
    }
  });
});

//obtener usuario por cuenta
app.get("/usuarios/cuenta/:user", function(req, res){
  trooperDataSchema.findOne({
    user: req.params.user.toLowerCase()
  }).exec(function(err, usuario){
    if(err){
      res.send(err.message);
      res.status(403).send({error: 'no se pudo obtener el usuario', mensaje: err.message}).end();
    }else{
      res.status(200).send({ok: 'usuario obtenido con éxito', usuario: usuario}).end();
    }
  });
});

//ingresar nuevo usuario forma 1 (por parte o por elemento)
app.post("/ingresar", function(req, res){
  var trooper = new trooperDataSchema();
  trooper.user = req.body.user.toLowerCase();
  trooper.nombre = req.body.nombre.toLowerCase();
  trooper.apellidos = req.body.apellidos.toLowerCase();
  trooper.password = encriptar.sha1(req.body.password);
  trooper.edad = req.body.edad.toLowerCase();
  trooper.nivelmilitar = req.body.nivelmilitar.toLowerCase();
  trooper.habilitado_para_usar_app = req.body.habilitado_para_usar_app;

  if(!validar.nivel_militar(req.body.nivelmilitar.toLowerCase())){
      res.status(403).send({error: 'nivel militar a ingresar no valido'});
  }else
  trooper.save(function(err, usuario){
    if(err){
      res.status(403).send({error: 'no se pudo ingresar el usuario', mensaje: err.message});
    }else{
      res.status(200).send({ok: 'usuario ingresado con éxito', usuario: usuario});
    }
    });
});

//ingresar nuevo usuario forma 2 (todo el objeto completo)
app.post("/ingresar2", function(req, res){
  if(!validar.nivel_militar(req.body.nivelmilitar.toLowerCase())){
      res.status(403).send({error: 'nivel militar a ingresar no valido'});
  }else
  trooperDataSchema.create(req.body, function(err, usuario){
    if(err){
      res.status(403).send({error: 'no se pudo ingresar el usuario', mensaje: err.message}).end();
    }else{
      res.status(200).send({ok: 'usuario ingresado con éxito', usuario: usuario}).end();
    }
  });
});

//modificar
app.put("/usuarios/:id",function(req, res){
  if(!validar.nivel_militar(req.body.nivelmilitar.toLowerCase())){
      res.status(403).send({error: 'nivel militar a modificar no valido'});
  }else
  trooperDataSchema.findOneAndUpdate({_id: req.params.id},
    {$set:
      {
        user: req.body.user.toLowerCase(),
        nombre: req.body.nombre.toLowerCase(),
        apellidos: req.body.apellidos.toLowerCase(),
        password: encriptar.sha1(req.body.password),
        edad: req.body.edad.toLowerCase(),
        nivelmilitar: req.body.nivelmilitar.toLowerCase(),
        habilitado_para_usar_app: req.body.habilitado_para_usar_app
      }},
  {upsert: true}, function(err, usuario){
    if(err){
      res.status(403).send({error: 'no se pudo modificar el usuario', mensaje: err.message}).end();
    }else{
      res.status(200).send({ok: 'usuario modificado con éxito', usuario: usuario}).end();
    }
  });
});

//borrar por id
app.delete("/usuarios/:id", function(req, res){
  trooperDataSchema.findOneAndRemove({
    _id: req.params.id
  }, function(err, usuario){
    if(err){
      res.status(403).send({error: 'no se pudo borrar el usuario', mensaje: err.message}).end();
    }else{
      res.status(200).send({ok: 'usuario borrado con éxito', usuario: usuario}).end();
    }
  });
});

//borrar todo
app.delete("/vaciar",function(req, res){
  trooperDataSchema.remove({}, function(err, usuarios){
    if(err){
      res.status(403).send({error: 'no se pudieron borrar los usuarios', mensaje: err.message}).end();
    }else{
      res.status(200).send({ok: 'usuarios borrados con éxito', usuarios: usuarios}).end();
    }
  });
});

function handleRequestTextPlain(request, response){
  response.statusCode = 200;
  response.setHeader('Contente-Type', 'text/plain');
  response.end('HelloWorld' + request.url);
};
