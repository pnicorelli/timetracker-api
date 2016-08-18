'use strict';

var auth = require('../auth/auth');


module.exports = (app) => {
  let members = require('../v1/members/members');

  app.post('/v1/members/login/password', members.loginWithPassword);
  app.post('/v1/members/login/code', members.loginWithCode);

  app.get('/v1/members/profile', auth.member(), members.profile);

  let timesheet = require('../v1/members/timesheet');

  app.get('/v1/members/timesheet', auth.member(), timesheet.getAll);
  app.post('/v1/members/timesheet', auth.member(), timesheet.create);

  app.get('/v1/members/timesheet/:timesheetId', auth.member(), timesheet.getOne);
  app.put('/v1/members/timesheet/:timesheetId', auth.member(), timesheet.closeOne);
  app.delete('/v1/members/timesheet/:timesheetId', auth.member(), timesheet.delete);

  app.post('/v1/members/afterwards', auth.member(), timesheet.afterwards);

  let suggestions = require('../v1/members/suggestions');

  app.post('/v1/members/suggestions', auth.member(), suggestions.create);
};
