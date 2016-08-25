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

describe('Member should use timesheet defered', () => {

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

  it('as a member I should insert a past time', function(next){
    let newDate = new Date();
    newDate.setDate(newDate.getDate() - 1);
    let newFrom = new Date(newDate), newTo = new Date(newDate);
    newFrom.setHours(16, 0, 0);
    newTo.setHours(18, 30, 0);

    request
    .post('localhost:3000/v1/members/afterwards')
    .set('Authorization', 'Token '+token)
    .send({
      from: newFrom,
      to: newTo
    })
    .end(function(err, res){
      res.statusCode.should.equal(201);
      res.body.timesheet._id.should.exist;
      res.body.timesheet.from.should.exist;
      res.body.timesheet.to.should.exist;
      res.body.timesheet.status.should.equal('afterwards');
      TimeSheet.findOne({ _id: res.body.timesheet._id}, (err, t)=>{
        expect( err ).to.not.exist;
        t.duration.should.equal(9000);
        return next();
      });

    });
  });

  it('as a member I should not insert a wrong past time', function(next){
    let newDate = new Date();
    newDate.setDate(newDate.getDate() - 1);
    let newFrom = new Date(newDate), newTo = new Date(newDate);
    newFrom.setHours(16, 0, 0);
    newTo.setHours(18, 30, 0);

    request
    .post('localhost:3000/v1/members/afterwards')
    .set('Authorization', 'Token '+token)
    .send({
      from: newTo,
      to: newFrom
    })
    .end(function(err, res){
      res.statusCode.should.equal(400);
      return next();
    });
  });

  it('as a member I should not insert a wrong past time', function(next){
    request
    .post('localhost:3000/v1/members/afterwards')
    .set('Authorization', 'Token '+token)
    .send({
      from: 'yesterday',
      to: 'tomorrow'
    })
    .end(function(err, res){
      res.statusCode.should.equal(400);
      return next();
    });
  });


  it('as a member I should not insert an incomplete past time', function(next){
    let newDate = new Date();
    newDate.setDate(newDate.getDate() - 1);
    let newFrom = new Date(newDate), newTo = new Date(newDate);
    newFrom.setHours(16, 0, 0);
    newTo.setHours(18, 30, 0);

    request
    .post('localhost:3000/v1/members/afterwards')
    .set('Authorization', 'Token '+token)
    .send({
      from: newFrom
    })
    .end(function(err, res){
      res.statusCode.should.equal(400);
      return next();

    });
  });

  it('as a member I should not insert an future time', function(next){
    let newFrom = new Date();
    newFrom.setHours( newFrom.getHours()-1);
    let newTo = new Date();
    newTo.setHours( newTo.getHours()+1);

    request
    .post('localhost:3000/v1/members/afterwards')
    .set('Authorization', 'Token '+token)
    .send({
      from: newFrom,
      to: newTo
    })
    .end(function(err, res){
      res.statusCode.should.equal(400);
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
