'use strict'

var chai = require('chai');
chai.should();
var expect = require('chai').expect;

var request = require('superagent');
var Promise = require('bluebird');

var User = require('../../src/models/User')

var userId;

describe('Security matters!', () => {

  before( done => {
    var newUser = new User({
      username: 'user-05-015',
      password: 'mylittlesecret'
    })
    newUser.save( (err, u)=>{
      expect(err).to.not.exists;
      expect(u).to.exists;
      userId = u._id;
      return done();
    })
  });

  it('should encrypt password on User.save()', (done) => {
    User.findOne({ _id: userId}).exec( (err, u)=>{
      expect(err).to.not.exists;
      expect(u).to.exists;
      let credential = require('credential');
      let pw = credential();
      pw.verify(u.password, 'mylittlesecret', function (err, isValid) {
        expect(err).to.not.exists;
        isValid.should.be.true;
        return done();
      });
    });
  });

  after( done => {
    Promise.all([
      User.remove({_id: userId})
    ]).then( result => {
      return done();
    });
  });
});
