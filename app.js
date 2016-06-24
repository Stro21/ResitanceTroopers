var express = require("express");
var app = express();
var http = require("http");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var server = http.createServer();
var expressJWT = require("express-jwt");
var db = "mongodb://<dbuser>:<dbpassword>@ds023074.mlab.com:23074/heroku_gfwc4rwz";
var key = "keydetesteo";
var port = 8000;

//MIS ARCHIVOS
var api = require('./routes/controllers/api');

mongoose.connect(db);

//configurar app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//app.use(expressJWT({secret: key}).unless({path: ['/login']}));

//******************************LLAMADAS***********************************************************************

//escuchando en puerto
app.listen(port, api.escuchando(port));

//pagina inicial
app.get("/", api.main);

//obtener usuario por id
app.get("/usuarios/:id", api.obtener_usuario_por_id);

//obtener todos los usuarios
app.get("/usuarios", api.obtener_usuarios);

//obtener usuario por cuenta
app.get("/usuarios/cuenta/:usuario", api.obtener_usuario_por_cuenta);

//ingresar nuevo usuario forma 1 (por parte o por elemento)
app.post("/ingresar", api.ingresar_nuevo_usuario);

//borrar todos los usuarios
app.delete("/usuarios/vaciar", api.borrar_todos_los_usuarios);

//borrar usuario por id
app.delete("/usuarios/:id", api.borrar_usuario_por_id);

//modificar usuario por id
app.put("/usuarios/:id", api.modificar_usario_por_id);

//login
app.post("/login", api.login);
