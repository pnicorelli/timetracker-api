'use strict';

var chai = require('chai');
chai.should();
var expect = require('chai').expect;

var request = require('superagent');
var Promise = require('bluebird');

var User = require('../../src/models/User');
var AccessToken = require('../../src/models/AccessToken');

var username, token;

describe('Someone can become a user', () => {

  before( next => {
    username = 'test05-10-auth';
    return next();
  });



  it('should not signup with uncomplete fields #1', (next) => {
    request
      .post('localhost:3000/v1/accounts/signup')
      .send({
        username: username
      })
      .end(function(err, res){
        res.statusCode.should.equal(400);
        res.body.message.should.not.be.empty;
        return next();
      });
  });

  it('should not signup with uncomplete fields #2', (next) => {
    request
      .post('localhost:3000/v1/accounts/signup')
      .send({
        password: 'somesecret'
      })
      .end(function(err, res){
        res.statusCode.should.equal(400);
        res.body.message.should.not.be.empty;
        return next();
      });
  });

  it('should signup a valid user', (next) => {
    request
      .post('localhost:3000/v1/accounts/signup')
      .send({
        username: username,
        password: 'somesecret'
      })
      .end(function(err, res){
        res.statusCode.should.equal(201);
        res.body.token.should.not.be.empty;
        token = res.body.token;
        return next();
      });
  });

  it('token should be valid', (next) => {
    request
      .get('localhost:3000/v1/accounts/profile')
      .set('Authorization', 'Bearer ' + token)
      .end(function(err, res){
        res.statusCode.should.equal(200);
        res.body.profile.username.should.equal(username);
        res.body.profile._id.should.be.not.empty;
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
