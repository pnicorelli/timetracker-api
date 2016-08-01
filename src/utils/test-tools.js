'use strict';

var Promise = require('bluebird');
var faker = require('faker');

var User = require('../../src/models/User');
var AccessToken = require('../../src/models/AccessToken');
var Member = require('../../src/models/Member');

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
    let compose =  module.parent.filename.split('/');
    username = ( username ) ? username: testTools._username();
    let user = new User({
      username: username,
      password: 'secret'
    });
    user.save( (err, u) => {
      if( err ){
        return reject(err);
      }
      let at = new AccessToken();
      at.create(u._id, (err, token)=>{
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
* - create a user, access token and mambers
*/
testTools.createUserAccessMembers = ( username, membersQuantity ) => {
  membersQuantity = (membersQuantity) ? membersQuantity : 10;
  return new Promise(function (resolve, reject) {
    testTools.createUserAccess(username).then( (result)=>{
      let members = [];
      for( let i=0; i<membersQuantity; i++){
        let mpro = new Member( {
          first: faker.name.firstName(),
          last: faker.name.lastName(),
          userId: result.userId
        });
        members.push(mpro.save());
      };
      Promise.all(members).then( ()=>{
        return resolve({
          userId: result.userId,
          username: result.username,
          token: result.token,
          members: membersQuantity
        });
      });
    });
  });
};




module.exports = testTools;
