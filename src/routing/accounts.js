'use strict';

var auth = require('../auth/auth');


module.exports = (app) => {
  let accounts = require('../v1/accounts/accounts');

  app.post('/v1/accounts/signup', accounts.signup);
  app.post('/v1/accounts/login', accounts.login);

  let members = require('../v1/accounts/members');

  app.get('/v1/accounts/members', auth.bearer(), members.getAll);
  app.post('/v1/accounts/members', auth.bearer(), members.create);
  //
  // app.get('/v1/accounts/:userId/members/:memberId', member.getOne);
  // app.put('/v1/accounts/:userId/members/:memberId', member.updateOne);
  // app.del('/v1/accounts/:userId/members/:memberId', member.deleteOne);

};
