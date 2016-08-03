'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

User.methods.checkPassword = (storedPassword, password, callback )=>{
  let user = this;
  // let argon2i = require('argon2-ffi').argon2i;
  //
  // argon2i.verify(storedPassword, password)
  //   .then(correct => {
  //     if( typeof callback === 'function'){
  //       return callback(correct);
  //     } else {
  //       return correct;
  //     }
  //   });
  let bcrypt = require('bcryptjs');
  bcrypt.compare(password, storedPassword, function(err, res) {
        if( typeof callback === 'function'){
          return callback(res);
        } else {
          return res;
        }
  });
};

User.pre('save', function(next) {
  let user = this;
  if( !user.password ){
    return next({'message': 'invalid password'});
  }

  // let argon2i = require('argon2-ffi').argon2i;
  // let crypto = require('crypto');
  // let Promise = require('bluebird');
  // let randomBytes = Promise.promisify(crypto.randomBytes);
  //
  // randomBytes(32)
  //   .then(salt => argon2i.hash(user.password, salt))
  //   .then(hash => {
  //     user.password = hash;
  //     return next();
  //   });

  let bcrypt = require('bcryptjs');
  bcrypt.genSalt(5, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
        user.password = hash;
        return next();
    });
  });
});

module.exports = mongoose.model('User', User);
