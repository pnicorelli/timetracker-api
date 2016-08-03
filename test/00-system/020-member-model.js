'use strict';

var chai = require('chai');
chai.should();
var expect = require('chai').expect;

var request = require('superagent');
var Promise = require('bluebird');

var Member = require('../../src/models/Member');

var ObjectId = require('mongoose').Types.ObjectId;

var memberId;

describe('Security matters!', () => {

  before( next => {
    var newMember = new Member({
      first: 'member-20-015',
      last: 'mylittlesecret',
      userId: new ObjectId()
    });
    newMember.save( (err, m)=>{
      expect(err).to.not.exist;
      expect(m).to.exist;
      memberId = m._id;
      return next();
    });
  });

  it('should generate password on Member.save()', (next) => {
    Member.findOne({ _id: memberId}).exec( (err, u)=>{
      expect(err).to.not.exist;
      expect(u).to.exist;
      expect(u.password).to.exist;
      expect(u.password.length).not.to.be.equal(0);
      return next();
    });
  });

  after( next => {
    Promise.all([
      Member.remove({_id: memberId})
    ]).then( result => {
      return next();
    });
  });
});
