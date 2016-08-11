'use strict';

var mongoose = require('mongoose');
var random = require('../utils/random');

var Schema = mongoose.Schema;

var Suggestion = new Schema({
  userId: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  memberId: {
    type: Schema.ObjectId,
    ref: 'Member'
  },
  message: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Suggestion', Suggestion);
