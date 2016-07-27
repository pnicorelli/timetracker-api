'use strict'

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

module.exports = mongoose.model('AccessToken', AccessToken);
