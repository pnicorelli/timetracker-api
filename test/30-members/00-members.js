'use strict';

var chai = require('chai');
chai.should();
var request = require('superagent');
var Promise = require('bluebird');

var testTools = require('../../src/utils/test-tools');
var Member = require('../../src/models/Member');

var carl, sigmund;

describe('User should CRUD members #1', () => {

  before( next => {
    Promise.all([
      testTools.createUserAccess('carlgustav'),
      testTools.createUserAccess('sigmund')
    ]).then( (result) =>{
      carl = result[0];
      sigmund = result[1];
      return next();
    });
  });

  it('as a unregistered user I should not list members', function(next){
    request
    .get('localhost:3000/v1/accounts/members')
    .end(function(err, res){
      res.statusCode.should.equal(401);
      res.body.should.be.empty;
      res.text.should.equal('Unauthorized');
      return next();
    });
  });

  it('as a unregistered user I should not create a new member', function(next){
    request
    .post('localhost:3000/v1/accounts/members')
    .send({
      member: {
        first: 'test-name',
        last: 'test-surname'
      }
    })
    .end(function(err, res){
      res.statusCode.should.equal(401);
      res.body.should.be.empty;
      res.text.should.equal('Unauthorized');
      return next();
    });
  });

  it('as a user I should fail to create a new member withoud required fields', function(next){
    request
    .post('localhost:3000/v1/accounts/members')
    .set('Authorization', 'Bearer ' + carl.token)
    .send({
      first: 'test-name-carl',
      last: 'test-surname-carl'
    })
    .end(function(err, res){
      res.statusCode.should.equal(400);
      res.body.message.should.equal('required fields missing');
      return next();
    });
  });

  it('as a user I should create a new member', function(next){
    request
    .post('localhost:3000/v1/accounts/members')
    .set('Authorization', 'Bearer ' + carl.token)
    .send({
      member: {
        first: 'test-name-carl',
        last: 'test-surname-carl'
      }
    })
    .end(function(err, res){
      res.statusCode.should.equal(201);
      res.body.member.first.should.equal('test-name-carl');
      return next();
    });
  });

  it('as a second user I should create a new member', function(next){
    request
    .post('localhost:3000/v1/accounts/members')
    .set('Authorization', 'Bearer ' + sigmund.token)
    .send({
      member: {
        first: 'test-name-sigmund',
        last: 'test-surname-sigmund'
      }
    })
    .end(function(err, res){
      res.statusCode.should.equal(201);
      res.body.member.first.should.equal('test-name-sigmund');
      return next();
    });
  });

  it('as a user I should list my members', function(next){
    request
    .get('localhost:3000/v1/accounts/members')
    .set('Authorization', 'Bearer ' + carl.token)
    .end(function(err, res){
      res.statusCode.should.equal(200);
      res.body.total.should.equal(1);
      res.body.data[0].first.should.equal('test-name-carl');
      return next();
    });
  });

  it('as a second user I should list my members', function(next){
    request
    .get('localhost:3000/v1/accounts/members')
    .set('Authorization', 'Bearer ' + sigmund.token)
    .end(function(err, res){
      res.statusCode.should.equal(200);
      res.body.total.should.equal(1);
      res.body.data[0].first.should.equal('test-name-sigmund');
      return next();
    });
  });


  after( next => {
    Promise.all([
      testTools.removeUserAccess(carl.username),
      testTools.removeUserAccess(sigmund.username),
      Member.remove({userId: carl.userId}).exec(),
      Member.remove({userId: sigmund.userId}).exec()
    ]).then( (result) =>{
      return next();
    });
  });
});
