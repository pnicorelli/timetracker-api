'use strict'

var chai = require('chai');
chai.should();
var expect = require('chai').expect;

var request = require('superagent');
var Promise = require('bluebird');

var User = require('../../src/models/User')
var AccessToken = require('../../src/models/AccessToken')
// var server = require('../../src/server')

var user, username, password, token;

describe('As a user I can log-in', () => {

  before( done => {
    username = 'user05-020';
    password = 'myverysecret';

    var testuser = new User({
      username: username,
      password: password
    })
    testuser.save().then( (err, u) => {
      user = u;
      return done();
    })

  });



  it('should login a valid user', (done) => {
    request
    .post('localhost:3000/v1/account/login')
    .send({
      username: username,
      password: password
    })
    .end(function(err, res){
      res.statusCode.should.equal(200);
      res.body.token.should.not.be.empty;
      token = res.body.token;
      return done();
    });
  });

  it('should not login a invalid user', (done) => {
    request
    .post('localhost:3000/v1/account/login')
    .send({
      username: 'littleredhood',
      password: 'ILoveWolwes'
    })
    .end(function(err, res){
      res.statusCode.should.equal(400);
      expect(res.body.message).to.exists;
      return done();
    });
  });

  it('should accept a call with valid auth', (done) => {
    request
    .get('localhost:3000/v1/profile')
    .set('Authorization', 'Bearer ' + token)
    .end(function(err, res){
      res.statusCode.should.equal(200);
      res.body.profile.username.should.equal(user.username);
      res.body.profile._id.should.be.not.empty;
      return done();
    });
  });


  after( done => {
    Promise.all([
      User.remove({username: username}),
      AccessToken.remove({token: token})
    ]).then( result => {
      return done();
    });
  });
})
