var validar = function(){
var self = this;
  var niveles_militares = [];
  niveles_militares.push("soldado");
  niveles_militares.push("oficial");
  niveles_militares.push("capitán");
  niveles_militares.push("capitan");

  self.nivel_militar = function(nivel){
    var i = 0;

    while(i < niveles_militares.length){
      if(nivel === niveles_militares[i].trim()){
        return true;
      }
      i++;
    }

    return false;
  };
};

module.exports = validar;
