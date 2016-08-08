'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var random = require('../utils/random');

var TimeSheet = new Schema({
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
  createdAt: {
    type: Date,
    default: Date.now
  },
  from: {
    type: Date,
    default: null
  },
  to: {
    type: Date,
    default: null
  },
  duration: {
    type: Number,
    default: -1
  },
  status: {
    type: String
    // started: member begin a job
    // complete: member finish a job
    // moderate: member force `from` and `to`, to be checked
    // invalid: account mark as invalid
  }
});


TimeSheet.methods.start = function(member) {
  let self = this;
  return new Promise(
    (resolve, reject)=>{
      let t = this;

      if (!mongoose.Types.ObjectId.isValid(member._id)) {
        return reject('invalid member');
      }

      self.memberId = member._id;
      self.userId = member.userId;
      self.status = 'started';
      self.createdAt = new Date;
      self.from = new Date;

      self.save((err, newTime) =>{
        if (err) {
          return reject(err);
        }
        return resolve(newTime);
      });
    }
  );

};


TimeSheet.methods.setClose = function() {
  let self = this;
  return new Promise(
    (resolve, reject)=>{
      let t = this;

      if (!self.from) {
        return reject('invalid from');
      }
      self.to = new Date;
      self.status = 'closed';

      self.duration =  parseInt(((self.to - self.from) / 1000));

      self.save((err, newTime) =>{
        if (err) {
          return reject(err);
        }
        return resolve(newTime);
      });
    }
  );

};

module.exports = mongoose.model('TimeSheet', TimeSheet);