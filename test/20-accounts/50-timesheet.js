'use strict';

var chai = require('chai');
chai.should();
var request = require('superagent');
var Promise = require('bluebird');

var testTools = require('../../src/utils/test-tools');
var TimeSheet = require('../../src/models/TimeSheet');

var carl, mTimesheet, testDate;

describe('User should manage timesheet', () => {

  before( next => {
    Promise.all([
      testTools.createUserAccessMembers('carlgustav', 3)
    ]).then( (result) =>{
      carl = result[0];
      Promise.all([
        testTools.createTimesheet(carl.members[0], 10),
        testTools.createTimesheet(carl.members[1], 15),
        testTools.createTimesheet(carl.members[2], 20)
      ]).then( (result)=>{
        mTimesheet = result;
        TimeSheet.findOne({memberId: mTimesheet[0].memberId}).exec( (err, t) => {
          testDate = t.from;
          t.status = 'started';
          t.save( (err, xxx)=>{
            return next();
          });
        });
      });
    });
  });

  it('as a unregistered user I should not read timesheet', function(next){
    request
    .get('localhost:3000/v1/accounts/timesheet')
    .set('Authorization', 'Bearer IWannaBeAFaker')
    .end(function(err, res){
      res.statusCode.should.equal(401);
      res.body.should.be.empty;
      res.text.should.equal('Unauthorized');
      return next();
    });
  });

  it('as a user I should read timesheet', function(next){
    request
    .get('localhost:3000/v1/accounts/timesheet')
    .set('Authorization', 'Bearer ' + carl.token)
    .end(function(err, res){
      let totalTimeSheet = 0;
      for( let i=0; i<mTimesheet.length; i++){
        totalTimeSheet += mTimesheet[i].timesheetIds.length;
      }
      res.statusCode.should.equal(200);
      res.body.total.should.equal( totalTimeSheet );
      return next();
    });
  });

  it('as a user I should read a member timesheet', function(next){
    request
    .get('localhost:3000/v1/accounts/timesheet')
    .set('Authorization', 'Bearer ' + carl.token)
    .query({
      memberId: mTimesheet[0].memberId.toString()
    })
    .end(function(err, res){
      res.statusCode.should.equal(200);
      res.body.data[0].memberId.should.equal( mTimesheet[0].memberId.toString() );
      res.body.total.should.equal( mTimesheet[0].timesheetIds.length );
      return next();
    });
  });

  it('as a user I should read timesheet with from-to date range', function(next){
    let newFrom = new Date(testDate), newTo = new Date(testDate);
    newFrom.setHours(0, 0, 0);
    newTo.setHours(23, 59, 59);

    request
    .get('localhost:3000/v1/accounts/timesheet')
    .set('Authorization', 'Bearer ' + carl.token)
    .query({
      from: newFrom,
      to: newTo
    })
    .end(function(err, res){
      res.statusCode.should.equal(200);
      TimeSheet.count({ from: {$gte: newFrom}, to: { $lte: newTo}}).exec( (err, count) => {
        res.body.total.should.equal( count );
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
