'use strict';

var Promise = require('bluebird');
var faker = require('faker');

var User = require('../../src/models/User');
var AccessToken = require('../../src/models/AccessToken');
var Member = require('../../src/models/Member');
var MemberToken = require('../../src/models/MemberToken');
var MemberAccessCode = require('../../src/models/MemberAccessCode');
var TimeSheet = require('../../src/models/TimeSheet');

var testTools = {

};

testTools._username = ()=>{
  return faker.internet.email();
};


/*
* TESTs utility
* - create a new user
* - create an access token for the user
* - return { userId, username, token }
*/
testTools.createUserAccess = function( username ){
  return new Promise(function (resolve, reject) {
    username = ( username ) ? username: testTools._username();
    let user = new User({
      username: username,
      password: 'secret',
      company: 'psyco'
    });
    user.save( (err, u) => {
      /* istanbul ignore if */
      if( err ){
        return reject(err);
      }
      let at = new AccessToken();
      at.create(u._id, (err, token)=>{
        /* istanbul ignore if */
        if( err ){
          return reject(err);
        }
        return resolve({
          userId: u._id,
          username: u.username,
          token: token
        });
      });
    });

  });
};

/*
* TESTs utility
* - delete user and all resources associated
*/
testTools.removeUserAccess = ( username ) => {
  return new Promise(function (resolve, reject) {
    if( !username ){
      reject( 'username mandatory' );
    }
    User.findOne({username: username}).then( (u)=>{
      Promise.all([
        Member.remove({userId: u._id}),
        MemberToken.remove({userId: u._id}),
        MemberAccessCode.remove({userId: u._id}),
        TimeSheet.remove({userId: u._id}),
        AccessToken.remove({userId: u._id}),
        User.remove({_id: u._id})
      ]).then( (result)=>{
        return resolve(result);
      });
    });
  });
};


/*
* TESTs utility
* - create a user, access token and members
*/
testTools.createUserAccessMembers = ( username, membersQuantity ) => {
  membersQuantity = (membersQuantity) ? membersQuantity : 10;
  return new Promise(function (resolve, reject) {
    username = ( username ) ? username: testTools._username();
    testTools.createUserAccess(username).then( (user)=>{
      let members = [];
      for( let i=0; i<membersQuantity; i++){
        let mpro = new Member( {
          first: faker.name.firstName(),
          last: faker.name.lastName(),
          userId: user.userId
        });
        members.push(mpro.save());
      };
      Promise.all(members).then( (result)=>{
        let mIds = result.map( function(item){
          return item._id;
        });
        return resolve({
          userId: user.userId,
          username: user.username,
          token: user.token,
          members: mIds
        });
      });
    });
  });
};


/*
* TESTs utility
* - create member with timesheet entries
*/
testTools.createMemberWithTimesheets = ( username, tsQuantity ) => {
  // tsQuantity = (tsQuantity) ? tsQuantity : 10;
  return new Promise(function (resolve, reject) {
    username = ( username ) ? username: testTools._username();
    testTools.createUserAccess(username).then( (user)=>{

      let m = new Member( {
        first: faker.name.firstName(),
        last: faker.name.lastName(),
        userId: user.userId
      });
      m.save( (err, member)=>{
        if( err ){
          reject( err );
        }
        testTools.createTimesheet( member, tsQuantity).then(
          (result) =>{
            return resolve({
              userId: user.userId,
              username: user.username,
              token: user.token,
              memberId: member._id,
              timesheetIds: result.timesheetIds
            });
          }
        );
      });

    });
  });
};


/*
* TESTs utility
* - create timesheet entries for a member
*/
testTools.createTimesheet = (memberId, tsQuantity) =>{
  return new Promise(function (resolve, reject) {
    Member.findOne({_id: memberId}, (err, member)=>{
      if( err ){
        reject( err );
      }
      if( !member ){
        reject( 'member not found' );
      }
      tsQuantity = (tsQuantity) ? tsQuantity : 10;
      let mtimesheet = [];
      for( let i=0; i<tsQuantity; i++){
        let start = faker.date.past();
        let end = start.getTime() + (Math.floor(Math.random() * 720))*60000;
        let duration = parseInt(((end - start) / 1000));
        let ts = new TimeSheet({
          memberId: member._id,
          userId: member.userId,
          from: start,
          to: end,
          duration: duration,
          status: 'complete'
        });
        mtimesheet.push(ts.save());
      }
      return Promise.all(mtimesheet).then( (saves)=>{
        let tsIds = saves.map( function(item){
          return item._id;
        });
        return resolve({
          memberId: member._id,
          timesheetIds: tsIds
        });
      });

    });
  });
};

module.exports = testTools;
