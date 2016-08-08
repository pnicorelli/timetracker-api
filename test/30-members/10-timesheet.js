'use strict';

var chai = require('chai');
chai.should();
var expect = require('chai').expect;

var request = require('superagent');
var Promise = require('bluebird');

var testTools = require('../../src/utils/test-tools');
var Member = require('../../src/models/Member');
var MemberToken = require('../../src/models/MemberToken');
var TimeSheet = require('../../src/models/TimeSheet');

var carl, token, timesheetId, timesheetId2;

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

  it('as a member I should start a time', function(next){
    request
    .post('localhost:3000/v1/members/timesheet')
    .set('Authorization', 'Token '+token)
    .end(function(err, res){
      res.statusCode.should.equal(201);
      res.body.timesheet._id.should.exist;
      res.body.timesheet.from.should.exist;
      res.body.timesheet.status.should.equal('started');
      timesheetId = res.body.timesheet._id;
      return next();
    });
  });

  it('as a member I should close a time', function(next){
    request
    .put('localhost:3000/v1/members/timesheet/'+timesheetId)
    .set('Authorization', 'Token '+token)
    .end(function(err, res){

      res.statusCode.should.equal(200);
      res.body.timesheet._id.should.exist;
      res.body.timesheet.from.should.exist;
      res.body.timesheet.status.should.equal('closed');
      expect( res.body.timesheet.duration ).to.be.at.least(0);
      return next();
    });
  });


  it('as a member I should start a time', function(next){
    request
    .post('localhost:3000/v1/members/timesheet')
    .set('Authorization', 'Token '+token)
    .end(function(err, res){
      res.statusCode.should.equal(201);
      res.body.timesheet._id.should.exist;
      res.body.timesheet.from.should.exist;
      res.body.timesheet.status.should.equal('started');
      timesheetId2 = res.body.timesheet._id;
      return next();
    });
  });


  it('as a member I should read a time', function(next){
    request
    .get('localhost:3000/v1/members/timesheet/'+timesheetId2)
    .set('Authorization', 'Token '+token)
    .end(function(err, res){
      res.statusCode.should.equal(200);
      res.body.timesheet._id.should.exist;
      res.body.timesheet.from.should.exist;
      res.body.timesheet.status.should.equal('started');
      return next();
    });
  });

  it('as a member I should read my timesheet', function(next){
    request
    .get('localhost:3000/v1/members/timesheet')
    .set('Authorization', 'Token '+token)
    .end(function(err, res){
      res.statusCode.should.equal(200);
      res.body.data[0]._id.should.exist;
      res.body.data[1]._id.should.exist;
      res.body.data[0].status.should.equal('closed');
      res.body.data[1].status.should.equal('started');
      return next();
    });
  });

  it('as a member I should delete a time', function(next){
    request
    .del('localhost:3000/v1/members/timesheet/'+timesheetId)
    .set('Authorization', 'Token '+token)
    .end(function(err, res){
      res.statusCode.should.equal(204);
      TimeSheet.count( { _id: timesheetId}, (err, ccc)=>{
        ccc.should.equal(0);
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