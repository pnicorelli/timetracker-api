'use strict';

var mongoose = require('mongoose');

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
    labels: {
      type: [String],
      default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Member', Member);
