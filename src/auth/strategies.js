'use strict';

var passport          = require('passport');
var BearerStrategy    = require('passport-http-bearer').Strategy;
var LocalStrategy     = require('passport-local').Strategy;
var User              = require('../models/User');
var AccessToken       = require('../models/AccessToken');


passport.use(new BearerStrategy(
    function(accessToken, next) {
        AccessToken.findOne({ token: accessToken }).then( token => {

            if (!token){
              return next(null, false);
            }

            User.findById(token.userId).then( user => {
                if (!user){
                  return next(null, false, { message: 'Unknown user' });
                }

                var info = { scope: '*' };
                return next(null, user, info);
            });
        });
    }
));

passport.use(new LocalStrategy(
  function(username, password, next) {
    User.findOne({ username: username }, function (err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(null, false);
      }
      if (!user.verifyPassword(password)) {
        return next(null, false);
      }
      return next(null, user);
    });
  }
));
