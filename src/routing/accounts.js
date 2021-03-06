'use strict';

var auth = require('../auth/auth');


module.exports = (app) => {
  let accounts = require('../v1/accounts/accounts');


  app.get('/v1/accounts/profile', auth.bearer(), accounts.profile);

  app.post('/v1/accounts/signup', accounts.signup);
  app.post('/v1/accounts/login', accounts.login);
  app.delete('/v1/accounts/delete', auth.bearer(), accounts.remove);
  // app.post('/v1/accounts/login', passport.local() );

  let members = require('../v1/accounts/members');

  app.get('/v1/accounts/members', auth.bearer(), members.getAll);
  app.post('/v1/accounts/members', auth.bearer(), members.create);

  app.get('/v1/accounts/members/:memberId', auth.bearer(), members.getOne);
  app.put('/v1/accounts/members/:memberId', auth.bearer(), members.updateOne);
  app.delete('/v1/accounts/members/:memberId', auth.bearer(), members.deleteOne);

  app.post('/v1/accounts/members/:memberId/code', auth.bearer(), members.createCode);

  let timesheet = require('../v1/accounts/timesheet');

  app.get('/v1/accounts/timesheet', auth.bearer(), timesheet.getAll);

};
