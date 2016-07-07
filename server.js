var express = require("express");
var app = express();
var http = require("http");
var bodyParser = require("body-parser");
var server = http.createServer();
var expressJWT = require("express-jwt");
var port = 5000;

//MIS ARCHIVOS
var api = require('./routes/controllers/api');
var key = require("./functions/key").key();

//configurar app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//app.use(expressJWT({secret: key}).unless({path: ['/login']}));
app.use(api.validar_token);
app.set('port', (process.env.PORT || 5000));
app.use(express.static('/public'));

//******************************LLAMADAS***********************************************************************

//pagina inicial
app.get("/", api.main);

/*USUARIOS*/
//obtener usuario por id
app.get("/usuarios/:id", api.obtenerUsuarioPorId);
//obtener todos los usuarios
app.get("/usuarios", api.obtenerUsuarios);
//ingresar nuevo usuario
app.post("/usuarios", api.ingresarNuevoUsuario);
//borrar todos los usuarios
app.delete("/usuarios", api.borrarTodosLosUsuarios);
//borrar usuario por id
app.delete("/usuarios/:id", api.borrarUsuarioPorId);
//modificar usuario por id
app.put("/usuarios/:id", api.modificarUsuarioPorId);

/*BATALLONES*/
//ingresar nuevo batallon
app.post("/batallones", api.ingresarNuevoBatallon);
//borrar batallon por id
app.delete("/batallones/:id", api.borrarBatallonPorId);
//borrar todos los batallones
app.delete("/batallones", api.borrarTodosLosBatallones);
//modificar batallon por id
app.put("/batallones/:id", api.modificarBatallonPorId);
//obtener todos los batallon
app.get("/batallones", api.obtenerBatallones);
//obtener batallon por id
app.get("/batallones/:id", api.obtenerBatallonPorId);

/*OBJETIVOS*/
app.post("/objetivos", api.consultarPunto);

/*ATAQUES*/
//atacar a batallon
app.post("/ataques/:id", api.atacarBatallonPorId);
//obtener todos los ataques
app.get("/ataques", api.obtenerAtaques);
//borrar todos los ataques
app.delete("/ataques", api.borrarTodosLosAtaques);

//login
app.post("/login", api.login);

//escuchando en puerto
app.listen(app.get('port'), function() {
  console.log('Escuchando en puerto: ', app.get('port'));
});
