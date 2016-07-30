'use strict';

var Promise = require('bluebird');

var User = require('../../src/models/User');
var AccessToken = require('../../src/models/AccessToken');

var testTools = {


  /*
   * TESTs utility
   * - create a new user (if username is not specified username = diname.filename of the test)
   * - create an access token for the user
   * - return { userId, username, token }
   */
  'createUserAccess': ( username ) => {
    return new Promise(function (resolve, reject) {
      let compose =  module.parent.filename.split('/');
      if( !username ){
        username = compose[ compose.length -2 ]+'.'+compose[ compose.length -1 ];
      }
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
  },

  /*
   * TESTs utility
   * - delete user and access token
   */
  'removeUserAccess': ( username ) => {
    return new Promise(function (resolve, reject) {
      let compose =  module.parent.filename.split('/');
      if( !username ){
        username = compose[ compose.length -2 ]+'.'+compose[ compose.length -1 ];
      }
      User.findOne({username: username}).then( (u)=>{
        Promise.all([
          AccessToken.remove({userId: u._id}),
          User.remove({_id: u._id})
        ]).then( (result)=>{
          return resolve(result);
        })
      });
    });
  }
}

module.exports = testTools;
