'use strict';

var passport = require('passport');

var auth = {
  bearer: () => {
    return passport.authenticate('bearer', {session: false});
  }
};

module.exports = auth;
