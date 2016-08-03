'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var random = require('../utils/random');

var AccessToken = new Schema({
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

AccessToken.methods.create = function (userId, callback){
  let t = this;
  t.token = random.alphanumeric();
  t.userId = userId;

  t.save((err, newToken) =>{
    if (err) {
      return callback(err);
    }
    callback(null, newToken.token);
  });
};

module.exports = mongoose.model('AccessToken', AccessToken);
