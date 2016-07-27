'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    providerId: {
        type: String
    },
    provider: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now
    }
});

User.virtual('userId')
    .get(function () {
        return this.id;
    });

module.exports = mongoose.model('User', User);
