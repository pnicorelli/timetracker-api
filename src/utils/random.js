'use strict';

var random = {

  'alphanumeric': function (slenght){
    slenght = slenght || 32;
    var code = '';
    var possible = '0123456789QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm';

    for( var i=0; i < slenght; i++ ){
        code += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return code;
  }


};

module.exports = random;
