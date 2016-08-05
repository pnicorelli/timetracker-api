'use strict';

var passport = require('passport');

var auth = {
  bearer: () => {
    return passport.authenticate('bearer', {session: false});
  },

  member: () => {
    return passport.authenticate('http-header-token', {session: false});
  }
};

module.exports = auth;
