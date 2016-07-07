var crypto = require('crypto');
var key = require("./key").key();

exports.sha1 = function (clave) {
    var myClave = crypto.createHash("sha1");
    myClave.update(clave);
    return myClave.digest('hex');
};

exports.pbkdf2 = function(clave){
    const key = crypto.pbkdf2Sync(clave, 'salt', 100000, 512, 'sha512');
    return key.toString('hex');
}
