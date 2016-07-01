var crypto = require('crypto');

exports.sha1 = function (clave) {
    var myClave = crypto.createHash("sha1");
    myClave.update(clave);
    return myClave.digest('hex');
};

exports.pbkdf2 = function(clave){
    var buf = crypto.randomBytes(16);
    buf.toString('hex');
    var key = crypto.pbkdf2Sync(clave, buf, 100000, 512, 'sha512');
    return key.toString('hex');
}
