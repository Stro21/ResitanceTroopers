exports.generar_random = function (min, max) {
  var probabilidiad =  Math.floor((Math.random() * max) + min);
  return probabilidiad;
};
