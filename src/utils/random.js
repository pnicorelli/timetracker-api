'use strict';

var random = {

  'alphanumeric': function (slenght){
    slenght = slenght || 32;
    let code = '';
    let possible = '0123456789QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm';

    for( let i=0; i < slenght; i++ ){
        code += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return code;
  },

  'numeric': function (slenght){
    slenght = slenght || 5;
    let code = '';
    let possible = '0123456789';

    for( let i=0; i < slenght; i++ ){
        code += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return code;
  }


};

module.exports = random;
