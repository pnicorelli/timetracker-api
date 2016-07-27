'use strict'

var passport = require('passport');
var pkg = require('../../package.json');
var auth = require('../auth/auth');

var account = require('./account');

module.exports = (app) => {
  app.get('/', (req, res, done) => {
    res.json({ 'app': pkg.name, 'ver': pkg.version});
    return done();
  });
  app.get('/v1/profile', auth.bearer(), (req, res, done) => {
    res.json({ 'profile': req.user });
    return done();
  });

  account(app);
}
