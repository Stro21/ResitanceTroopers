var dotenv = require("dotenv");

exports.key = function (nivel) {
  dotenv.config({silent: true});
  //dotenv.config({path: '/custom/path/to/your/env/vars'}); //cambiar ruta del archivo .env
  dotenv.load();
  return process.env.KEY;
};
