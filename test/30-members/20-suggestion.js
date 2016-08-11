'use strict';

var chai = require('chai');
chai.should();
var expect = require('chai').expect;

var request = require('superagent');
var Promise = require('bluebird');

var testTools = require('../../src/utils/test-tools');
var Member = require('../../src/models/Member');
var MemberToken = require('../../src/models/MemberToken');
var Suggestion = require('../../src/models/Suggestion');

var carl, token;

describe('User should use timesheet', () => {

  before( next => {
    Promise.all([
      testTools.createUserAccessMembers('carlgustav', 1)
    ]).then( (result) =>{
      carl  = result[0];
      Member.findOne({userId: carl.userId}).exec( (err, member) =>{
        expect(err).to.be.null;
        let mt = new MemberToken();
        mt.create( member, (err, newToken)=>{
          expect(err).to.be.null;
          token = newToken;
          return next();
        });
      });
    });
  });

  it('as not a member I should not create a suggestion', function(next){
    request
    .post('localhost:3000/v1/members/suggestions')
    .set('Authorization', 'Token justafaketoken')
    .end(function(err, res){
      res.statusCode.should.equal(401);
      return next();
    });
  });

  it('as a member I should not create a suggestion on missing message', function(next){
    request
    .post('localhost:3000/v1/members/suggestions')
    .set('Authorization', 'Token '+token)
    .end(function(err, res){
      res.statusCode.should.equal(400);
      return next();
    });
  });

  it('as a member I should create a suggestion', function(next){
    request
    .post('localhost:3000/v1/members/suggestions')
    .set('Authorization', 'Token '+token)
    .send({
      message: 'Lorem ipsum'
    })
    .end(function(err, res){
      res.statusCode.should.equal(201);
      Suggestion.findOne( {userId: carl.userId}, (err, s)=>{
        expect(err).to.not.exist;
        s.message.should.equal('Lorem ipsum');
        return next();
      });
    });
  });

  after( next => {
    Promise.all([
      testTools.removeUserAccess(carl.username),
      Suggestion.remove({userI: carl.userId})
    ]).then( (result) =>{
      return next();
    });
  });
});
