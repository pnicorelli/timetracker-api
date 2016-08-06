'use strict';

var auth = require('../auth/auth');


module.exports = (app) => {
  let members = require('../v1/members/members');

  app.post('/v1/members/login/password', members.loginWithPassword);
  app.post('/v1/members/login/code', members.loginWithCode);
  app.get('/v1/members/profile', auth.member(), members.profile);


};
