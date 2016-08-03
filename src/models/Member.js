'use strict';

var mongoose = require('mongoose');
var random = require('../utils/random');

var Schema = mongoose.Schema;

var Member = new Schema({
    userId: {
        type: Schema.ObjectId,
        required: true,
        ref: 'User'
    },
    first: {
      type: String,
      default: null
    },
    last: {
      type: String,
      default: null
    },
    email: {
      type: String,
      default: null
    },
    password: {
      type: String, //Used for login
      unique: true
    },
    labels: {
      type: [String],
      default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


Member.methods.getUniquePassword = function( next ){
    let member = mongoose.model('Member');
    let randomPassword = random.alphanumeric(32);
    member.count({password: randomPassword}).exec( function(err, count){
      if(err){
        next(new Error(err.toString()));
      }
      if( count === 0){
        next( randomPassword );
      } else {
        member.getUniquePassword( next );
      }
    });
};

Member.pre('save', function(next) {
  let member = this;
  if( typeof member.password === 'undefined' ){
    member.getUniquePassword( function(newPassword){
      member.password = newPassword;
      return next();
    } );
  } else {
    return next();
  }
});

module.exports = mongoose.model('Member', Member);
