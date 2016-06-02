var crypto = require('crypto');

var encriptacion = function(){
var self = this;

  /*function sha1(clave){
    var myClave = crypto.createHash("sha1");
    myClave.update(clave);
    return myClave.digest('hex');
  };*/

  self.sha1 = function(clave){
    var myClave = crypto.createHash("sha1");
    myClave.update(clave);
    return myClave.digest('hex');
  };
};

module.exports = encriptacion;
