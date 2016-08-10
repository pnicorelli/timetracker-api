'use strict';

var chai = require('chai');
chai.should();
var request = require('superagent');
var Promise = require('bluebird');

var User = require('../../src/models/User');
var AccessToken = require('../../src/models/AccessToken');
// var server = require('../../src/server')

var user, token, invalidToken;

describe('User shoud be authenticated', () => {

  before( next => {
    var testuser = new User({
      username: 'carl',
      password: 'yourwayisnotmine',
      company: 'psyco'
    });
    testuser.save().then( u => {

      user = u;

      var testtoken = new AccessToken({
          userId: user._id,
          token: 'QWERTYUIOPASDFGHJKLZXCVBNM'
      });

      testtoken.save().then( t => {
        token = t;
        var invalidUserToken = new AccessToken({
            userId: t._id, //just a mongoId
            token: 'AAAAAAAAAAAAAAAAAAAAAAAA'
        });
        invalidUserToken.save( function(err, t2){
          invalidToken = t2;
        });

        return next();
      });
    });
  });



  it('should reject a call without auth', (next) => {
    request
      .get('localhost:3000/v1/accounts/profile')
      .end(function(err, res){
        res.statusCode.should.equal(401);
        res.body.should.be.empty;
        res.text.should.equal('Unauthorized');
        return next();
      });
  });

  it('should accept a call with valid auth', (next) => {
    request
      .get('localhost:3000/v1/accounts/profile')
      .set('Authorization', 'Bearer ' + token.token)
      .end(function(err, res){
        res.statusCode.should.equal(200);
        res.body.profile.username.should.equal(user.username);
        res.body.profile._id.should.be.not.empty;
        return next();
      });
  });

  it('should reject a call with unvalid auth', (next) => {
    request
      .get('localhost:3000/v1/accounts/profile')
      .set('Authorization', 'Bearer INVALIDTOKEN')
      .end(function(err, res){
        res.statusCode.should.equal(401);
        res.body.should.be.empty;
        res.text.should.equal('Unauthorized');
        return next();
      });
  });

  it('should reject a call with valid token but invalid user', (next) => {
    request
      .get('localhost:3000/v1/accounts/profile')
      .set('Authorization', 'Bearer '+invalidToken.token)
      .end(function(err, res){
        res.statusCode.should.equal(401);
        res.body.should.be.empty;
        res.text.should.equal('Unauthorized');
        return next();
      });
  });

  after( next => {
    Promise.all([
      User.remove({_id: user._id}),
      AccessToken.remove({userId: user._id}),
      AccessToken.remove({token: invalidToken.token})
    ]).then( result => {
      return next();
    });
  });
});
