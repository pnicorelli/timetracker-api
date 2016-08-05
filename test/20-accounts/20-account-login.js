'use strict';

var chai = require('chai');
chai.should();
var expect = require('chai').expect;

var request = require('superagent');
var Promise = require('bluebird');

var User = require('../../src/models/User');
var AccessToken = require('../../src/models/AccessToken');
// var server = require('../../src/server')

var user, username, password, token;

describe('As a user I want log-in', () => {

  before( next => {
    username = 'user05-020';
    password = 'myverysecret';

    var testuser = new User({
      username: username,
      password: password
    });
    testuser.save().then( (err, u) => {
      user = u;
      return next();
    });

  });



  it('should login with an valid user', (next) => {
    request
    .post('localhost:3000/v1/accounts/login')
    .send({
      username: username,
      password: password
    })
    .end(function(err, res){
      res.statusCode.should.equal(201);
      res.body.token.should.not.be.empty;
      token = res.body.token;
      return next();
    });
  });

  it('should not login with an invalid user', (next) => {
    request
    .post('localhost:3000/v1/accounts/login')
    .send({
      username: 'littleredhood',
      password: 'ILoveWolwes'
    })
    .end(function(err, res){
      res.statusCode.should.equal(404);
      expect(res.body.message).to.exist;
      return next();
    });
  });

  it('should accept a call with valid auth', (next) => {
    request
    .get('localhost:3000/v1/profile')
    .set('Authorization', 'Bearer ' + token)
    .end(function(err, res){
      res.statusCode.should.equal(200);
      res.body.profile.username.should.equal(username);
      res.body.profile._id.should.be.not.empty;
      expect(res.body.profile.password).to.not.exist;
      return next();
    });
  });


  after( next => {
    Promise.all([
      User.remove({username: username}),
      AccessToken.remove({token: token})
    ]).then( result => {
      return next();
    });
  });
});
