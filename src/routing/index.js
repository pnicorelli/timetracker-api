'use strict'

var passport = require('passport');
var pkg = require('../../package.json');
var auth = require('../auth/auth');

var account = require('./account');

module.exports = (app) => {
  app.get('/', (req, res, next) => {
    res.json({ 'app': pkg.name, 'ver': pkg.version});
    return next();
  });
  app.get('/v1/profile', auth.bearer(), (req, res, next) => {
    let payload = {
      _id: req.user._id,
      username: req.user.username
    }
    res.json({ 'profile': payload });
    return next();
  });

  account(app);
}
