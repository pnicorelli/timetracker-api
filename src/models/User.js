'use strict'

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

User.pre('save', function(next) {
  let user = this;
  if( !user.password ){
    return next({'message': 'invalid password'});
  }
  let credential = require('credential');
  let pw = credential();
  pw.hash(user.password, function (err, hash) {
    if (err){
       throw err;
     }
    user.password = hash;
    return next();
  });
});

module.exports = mongoose.model('User', User);
