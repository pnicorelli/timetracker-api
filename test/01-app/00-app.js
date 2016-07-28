'use strict'

var chai = require('chai');
chai.should();
var request = require('superagent');


var server = require('../../src/server');
var pkg = require('../../package.json');

describe('App should work', () => {

  before( next => {
    server.start();
    return next();
  }

  );
  it('should listen on port 3000', (next) => {
    request
      .get('localhost:3000/')
      .end(function(err, res){
          res.body.app.should.equal(pkg.name)
          res.body.ver.should.equal(pkg.version)
          return next();
      });
  });

  after( next => {
    return next();
  });
})
