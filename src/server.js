'use strict';

var express = require('express');
var passport = require('passport');
var pkg = require('../package.json');
var bodyParser = require('body-parser');
var config = require('config');
var compress = require('compression');
var cors = require('cors');
var strategies = require('./auth/strategies');
var routing = require('./routing');

var db = require('./db');
var app = express();

var Server = {

  start(){
    /* istanbul ignore if */
    if( !process.env.NODE_ENV ){
      process.env.NODE_ENV = 'development';
    }


    db.connect();
    // app.use(cors());

    app.use(compress());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.use(passport.initialize());

    app.options('*', cors());
    routing(app);

    var env = config.get('env');
    let port = process.env.OPENSHIFT_NODEJS_PORT || env.port;
    let ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
    this.server = app.listen(port, ip, function() {
      process.title = pkg.name;
      var path = require('path');
      var appDir = path.dirname(require.main.filename);
      //TODO use loglevel
      if( process.env.NODE_ENV !== 'test' ){
        var dbconf = config.get('database');
        console.log(`${pkg.name}-v${pkg.version} is listening on port ${port}!
          - NODE_ENV: ${process.env.NODE_ENV}
          - PATH    : ${appDir}
          - CONFIG  : ./config/${process.env.NODE_ENV}.json
          - DBURL   : ${dbconf.url}
          - PID     : ${process.pid}
          `);
      }
    });
  },

  close( next ){
    console.log(`${pkg.name}-v${pkg.version} is shutdown!`);
    db.close();
    this.server.close();
    return next();
  }

};


module.exports = Server;
