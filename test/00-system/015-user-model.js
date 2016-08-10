'use strict';

var chai = require('chai');
chai.should();
var expect = require('chai').expect;

var request = require('superagent');
var Promise = require('bluebird');

var User = require('../../src/models/User');

var userId;

describe('Security matters!', () => {

  before( next => {
    var newUser = new User({
      username: 'user-05-015',
      password: 'mylittlesecret',
      company: 'justaname'
    });
    newUser.save( (err, u)=>{
      expect(err).to.not.exist;
      expect(u).to.exist;
      userId = u._id;
      return next();
    });
  });

  it('should encrypt password on User.save()', (next) => {
    User.findOne({ _id: userId}).exec( (err, u)=>{
      expect(err).to.not.exist;
      expect(u).to.exist;
      expect(u.password).not.to.be.equal('mylittlesecret');
      return next();
    });
  });

  after( next => {
    Promise.all([
      User.remove({_id: userId})
    ]).then( result => {
      return next();
    });
  });
});
