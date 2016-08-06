'use strict';

var chai = require('chai');
chai.should();
var expect = require('chai').expect;

var request = require('superagent');
var Promise = require('bluebird');

var testTools = require('../../src/utils/test-tools');
var Member = require('../../src/models/Member');
var MemberAccessCode = require('../../src/models/MemberAccessCode');

var carl, memberPassword, token, code;

describe('User should update and delete a member', () => {

  before( next => {
    Promise.all([
      testTools.createUserAccessMembers('carlgustav', 2)
    ]).then( (result) =>{
      carl  = result[0];
      Member.find({userId: carl.userId}).exec( (err, members) =>{
        expect(err).to.be.null;
        memberPassword = members[0].password;
        let ac = new MemberAccessCode();
        ac.create( members[0], (err, newCode)=>{
          expect(err).to.be.null;
          code = newCode;
          return next();
        });
      });
    });
  });

  it('as a member I should not login without password', function(next){
    request
    .post('localhost:3000/v1/members/login/password')
    .end(function(err, res){
      res.statusCode.should.equal(404);
      return next();
    });
  });

  it('as a member I should not login with wrong password', function(next){
    request
    .post('localhost:3000/v1/members/login/password')
    .send({
      password: 'BatteryHorseStapleCorrect'
    })
    .end(function(err, res){
      res.statusCode.should.equal(404);
      return next();
    });
  });

  it('as a member I should login with password', function(next){
    request
    .post('localhost:3000/v1/members/login/password')
    .send({
      password: memberPassword
    })
    .end(function(err, res){
      res.statusCode.should.equal(201);
      res.body.token.should.not.be.empty;
      token = res.body.token;
      return next();
    });
  });


  it('as a member I should get my profile', function(next){
    request
    .get('localhost:3000/v1/members/profile')
    .set('Authorization', 'Token ' + token)
    .end(function(err, res){
      res.statusCode.should.equal(200);
      res.body.member.should.not.be.empty;
      res.body.member.first.should.not.be.empty;
      res.body.member.last.should.not.be.empty;
      return next();
    });
  });

  it('as a non member I should non get my profile', function(next){
    request
    .get('localhost:3000/v1/members/profile')
    .set('Authorization', 'Token BatteryHorseStapleCorrect')
    .end(function(err, res){
      res.statusCode.should.equal(401);
      return next();
    });
  });



  it('as a member I should not login with wrong code', function(next){
    request
    .post('localhost:3000/v1/members/login/code')
    .send({
      password: 'BatteryHorseStapleCorrect'
    })
    .end(function(err, res){
      res.statusCode.should.equal(404);
      return next();
    });
  });

  it('as a member I should login with code', function(next){
    request
    .post('localhost:3000/v1/members/login/code')
    .send({
      code: code
    })
    .end(function(err, res){
      res.statusCode.should.equal(201);
      res.body.token.should.not.be.empty;
      token = res.body.token;
      return next();
    });
  });



  it('as a member I should get my profile with new token', function(next){
    request
    .get('localhost:3000/v1/members/profile')
    .set('Authorization', 'Token ' + token)
    .end(function(err, res){
      res.statusCode.should.equal(200);
      res.body.member.should.not.be.empty;
      res.body.member.first.should.not.be.empty;
      res.body.member.last.should.not.be.empty;
      return next();
    });
  });


  after( next => {
    Promise.all([
      testTools.removeUserAccess(carl.username)
    ]).then( (result) =>{
      return next();
    });
  });
});
