var crypto = require('crypto');

exports.sha1 = function(clave){
  var myClave = crypto.createHash("sha1");
  myClave.update(clave);
  return myClave.digest('hex');
};
