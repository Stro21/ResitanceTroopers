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
//app.use(expressJWT({secret: key}).unless({path: ['/login'}));
app.use(api.validar_token);
app.set('port', (process.env.PORT || 5000));
app.use(express.static('/public'));

//******************************LLAMADAS***********************************************************************

//pagina inicial
app.get("/", api.main);

/*USUARIOS*/
//obtener usuario por id
app.get("/usuarios/:id", api.obtener_usuario_por_id);
//obtener todos los usuarios
app.get("/usuarios", api.obtener_usuarios);
//obtener usuario por cuenta
app.get("/usuarios/cuenta/:usuario", api.obtener_usuario_por_cuenta);
//ingresar nuevo usuario
app.post("/usuarios", api.ingresar_nuevo_usuario);
//borrar todos los usuarios
app.delete("/usuarios", api.borrar_todos_los_usuarios);
//borrar usuario por id
app.delete("/usuarios/:id", api.borrar_usuario_por_id);
//modificar usuario por id
app.put("/usuarios/:id", api.modificar_usario_por_id);

/*BATALLONES*/
//ingresar nuevo batallon
app.post("/batallones", api.ingresar_nuevo_batallon);
//borrar batallon por id
app.delete("/batallones/:id", api.borrar_batallon_por_id);
//borrar todos los batallones
app.delete("/batallones", api.borrar_todos_los_batallones);
//modificar batallon por id
app.put("/batallones/:id", api.modificar_batallon_por_id);
//obtener todos los batallon
app.get("/batallones", api.obtener_batallones);
//obtener batallon por id
app.get("/batallones/:id", api.obtener_batallon_por_id);

/*ATAQUES*/
//atacar a batallon
app.post("/ataques", api.atacar_posicion);
//obtener todos los ataques
app.get("/ataques", api.obtener_ataques);
//borrar todos los ataques
app.delete("/ataques", api.borrar_todos_los_ataques);

//login
app.post("/login", api.login);

//escuchando en puerto
app.listen(app.get('port'), function() {
  console.log('Escuchando en puerto: ', app.get('port'));
});
