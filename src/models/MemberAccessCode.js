'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var random = require('../utils/random');

var MemberAccessCode = new Schema({
    memberId: {
        type: Schema.ObjectId,
        required: true,
        ref: 'Member'
    },
    userId: {
        type: Schema.ObjectId,
        required: true,
        ref: 'User'
    },
    code: {
        type: String,
        unique: true,
        required: true
    },
    createdAt: {
      type: Date,
      expires: 900,
      default: Date.now
    }
});

MemberAccessCode.methods.create = function (member, callback){
  let e = this;
  // console.log( member )
  e.code = random.numeric();
  e.memberId = member._id;
  e.userId = member.userId;
  e.createdAt = new Date;

  e.save((err, newCode) =>{
    if (err) {
      return callback(err, null);
    }
    callback(null, newCode.code);
  });
};

module.exports = mongoose.model('MemberAccessCode', MemberAccessCode);
