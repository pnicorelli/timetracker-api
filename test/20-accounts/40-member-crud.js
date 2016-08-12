'use strict';

var chai = require('chai');
chai.should();
var expect = require('chai').expect;

var request = require('superagent');
var Promise = require('bluebird');

var testTools = require('../../src/utils/test-tools');
var Member = require('../../src/models/Member');

var carl, theMemberId;

describe('User should update and delete a member', () => {

  before( next => {
    Promise.all([
      testTools.createUserAccessMembers('carlgustav', 25)
    ]).then( (result) =>{
      carl  = result[0];
      return next();
    });
  });

  it('as a user I should list all my members', function(next){
    request
    .get('localhost:3000/v1/accounts/members?perPage='+carl.members.length)
    .set('Authorization', 'Bearer ' + carl.token)
    .end(function(err, res){
      res.statusCode.should.equal(200);
      res.body.total.should.equal(carl.members.length);
      res.body.perPage.should.equal(carl.members.length);
      theMemberId = res.body.data[0]._id;
      return next();
    });
  });

  it('as a user I should update a member', function(next){
    request
    .put('localhost:3000/v1/accounts/members/'+theMemberId)
    .set('Authorization', 'Bearer ' + carl.token)
    .send({
      member: {
        first: 'Sabina',
        last: 'Spielrein'
      }
    })
    .end(function(err, res){
      res.statusCode.should.equal(200);
      Member.findOne({ _id: theMemberId}).then( (m)=>{
        m.first.should.equal('Sabina');
        m.last.should.equal('Spielrein');
        return next();
      });
    });
  });


  it('as a user I should read a member', function(next){
    request
    .get('localhost:3000/v1/accounts/members/'+theMemberId)
    .set('Authorization', 'Bearer ' + carl.token)
    .end(function(err, res){
      res.statusCode.should.equal(200);
      res.body.member.first.should.equal('Sabina');
      res.body.member.last.should.equal('Spielrein');
      return next();
    });
  });


  it('as a user I can create a password code for a member', function(next){
    request
    .post('localhost:3000/v1/accounts/members/'+theMemberId+'/code')
    .set('Authorization', 'Bearer ' + carl.token)
    .end(function(err, res){
      res.statusCode.should.equal(201);
      expect(res.body.code).to.have.lengthOf(5);
      return next();
    });
  });

  it('as a user I should delete a member', function(next){
    request
    .del('localhost:3000/v1/accounts/members/'+theMemberId)
    .set('Authorization', 'Bearer ' + carl.token)
    .end(function(err, res){
      res.statusCode.should.equal(204);
      Member.findOne({ _id: theMemberId}).then( (m)=>{
        expect(m).to.not.exist;
        return next();
      });
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
