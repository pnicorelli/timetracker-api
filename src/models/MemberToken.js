'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var random = require('../utils/random');

var MemberToken = new Schema({
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
    token: {
        type: String,
        unique: true,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

MemberToken.methods.create = function (member, callback){
  let t = this;
  t.token = random.alphanumeric();
  t.memberId = member._id;
  t.userId = member.userId;

  t.save((err, newToken) =>{
    if (err) {
      return callback(err);
    }
    callback(null, newToken.token);
  });
};

module.exports = mongoose.model('MemberToken', MemberToken);
