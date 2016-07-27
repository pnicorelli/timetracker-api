'use strict'

var chai = require('chai');
chai.should();
var expect = require('chai').expect;

var request = require('superagent');
var Promise = require('bluebird');

var User = require('../../src/models/User')
var AccessToken = require('../../src/models/AccessToken')

var username, token;

describe('Someone can become a user', () => {

  before( done => {
    username = 'test05-10-auth';
    return done();
  });



  it('should not signup with uncomplete fields #1', (done) => {
    request
      .post('localhost:3000/v1/account/signup')
      .send({
        username: username
      })
      .end(function(err, res){
        res.statusCode.should.equal(400);
        res.body.message.should.not.be.empty;
        return done();
      });
  });

  it('should not signup with uncomplete fields #2', (done) => {
    request
      .post('localhost:3000/v1/account/signup')
      .send({
        password: 'somesecret'
      })
      .end(function(err, res){
        res.statusCode.should.equal(400);
        res.body.message.should.not.be.empty;
        return done();
      });
  });

  it('should signup a valid user', (done) => {
    request
      .post('localhost:3000/v1/account/signup')
      .send({
        username: username,
        password: 'somesecret'
      })
      .end(function(err, res){
        res.statusCode.should.equal(201);
        res.body.token.should.not.be.empty;
        token = res.body.token;
        return done();
      });
  });

  it('token should be valid', (done) => {
    request
      .get('localhost:3000/v1/profile')
      .set('Authorization', 'Bearer ' + token)
      .end(function(err, res){
        res.statusCode.should.equal(200);
        res.body.profile.username.should.equal(username);
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
