'use strict'

var auth = require('../auth/auth');


module.exports = (app) => {
  let account = require('../v1/account')
  /*
   *
   */
  app.post('/v1/account/signup', account.signup);


}
