'use strict';

var passport          = require('passport');
var BearerStrategy    = require('passport-http-bearer').Strategy;
var HTTPHeaderTokenStrategy = require('passport-http-header-token').Strategy;
var User              = require('../models/User');
var MemberToken              = require('../models/MemberToken');
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

passport.use(new HTTPHeaderTokenStrategy(
  function(token, done) {
    MemberToken.findOne({ token: token }).populate('memberId').then( mt => {

      if(!mt){
        return done(null, false);
      }
      return done(null, mt.memberId);
    });
  }
));
