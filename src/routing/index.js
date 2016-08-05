'use strict';

var passport = require('passport');
var pkg = require('../../package.json');
var auth = require('../auth/auth');

var accounts = require('./accounts');
var members = require('./members');

module.exports = (app) => {
  app.get('/', (req, res, next) => {
    res.json({ 'app': pkg.name, 'ver': pkg.version});
    return next();
  });

  accounts(app);
  members(app);

};
