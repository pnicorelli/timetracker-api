'use strict';

var chai = require('chai');
chai.should();
var expect = require('chai').expect;

var request = require('superagent');
var Promise = require('bluebird');
var testTools = require('../../src/utils/test-tools');
var User = require('../../src/models/User');

var carl;

describe('A user can remove his account', () => {

  before( next => {
    Promise.all([
      testTools.createUserAccess('carlgustav')
    ]).then( (result) =>{
      carl = result[0];
      return next();
    });
  });



  it('should destroy my account', (next) => {
    request
      .delete('localhost:3000/v1/accounts/delete')
      .set('Authorization', 'Bearer ' + carl.token)
      .end(function(err, res){
        res.statusCode.should.equal(204);
        User.findOne( {_id: carl.userId}, (err, u)=>{
          expect( err ).to.not.exist;
          expect( u ).to.not.exist;
          return next();
        });
      });
  });


  after( next => {

      return next();

  });
});
