var dotenv = require("dotenv");

exports.key = function (nivel) {
  dotenv.config({silent: true});
  //dotenv.config({path: '/custom/path/to/your/env/vars'}); 
  dotenv.load();
  return process.env.KEY;
};
