'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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

var getRandomToken = () => {
  return Math.random().toString(35).substr(2, 40);
}

AccessToken.methods.create = function (userId, callback){
  let t = this;
  t.token = getRandomToken();
  t.userId = userId;

  t.save((err, newToken) =>{
    if (err) {
      return callback(err);
    }
    callback(null, newToken.token);
  });
}

module.exports = mongoose.model('AccessToken', AccessToken);
