var niveles_militares = [];
niveles_militares.push("soldado");
niveles_militares.push("oficial");
niveles_militares.push("capitán");
niveles_militares.push("general");

exports.obtener_niveles_militares = function(){
  return niveles_militares;
};

exports.nivel_militar = function (nivel) {

    var i = 0;

    while (i < niveles_militares.length) {
        if (nivel.trim() === niveles_militares[i]) {
            return true;
        }
        i++;
    }
    return false;
};
