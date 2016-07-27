'use strict'

var auth = require('../auth/auth');

module.exports = (app) => {

  app.post('/v1/signup', (req, res, next) => {
      res.send({'uno': 'due'});
      return next();
    })
}
