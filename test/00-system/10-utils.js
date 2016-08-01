'use strict';

var chai = require('chai');
chai.should();
var expect = require('chai').expect;

var Promise = require('bluebird');

var User = require('../../src/models/User');
var AccessToken = require('../../src/models/AccessToken');

var testTools = require('../../src/utils/test-tools');

var user_carl    = 'carlgustav',
    user_anon,   // should be autoassigned
    token_carl,
    token_anon;

describe('Tools, Utility and other stuff', () => {

  it('should create a user access', (next) => {
    Promise.all([
      testTools.createUserAccess(user_carl),
      testTools.createUserAccess()
    ]).then( (result) =>{
      expect( result[0].token ).to.be.a('string');
      expect( result[1].token ).to.be.a('string');
      expect( result[1].username ).to.be.a('string');
      token_carl = result[0].token;
      token_anon = result[1].token;
      user_anon = result[1].username;
      return result;
    }).then( result => {
      Promise.all([
        AccessToken.findOne({token: token_carl}).populate('userId').lean().exec(),
        AccessToken.findOne({token: token_anon}).populate('userId').lean().exec()
      ]).then( result =>{
        result[0].token.should.equal( token_carl );
        result[0].userId.username.should.equal( user_carl );
        result[1].token.should.equal( token_anon );
        result[1].userId.username.should.equal( user_anon );
        return next();
      });
    });
  });



    it('should remove a user access', (next) => {
      Promise.all([
        testTools.removeUserAccess(user_carl),
        testTools.removeUserAccess(user_anon)
      ]).then( (result) =>{
        Promise.all([
          AccessToken.findOne({token: token_carl}).populate('userId').lean().exec(),
          AccessToken.findOne({token: token_anon}).populate('userId').lean().exec(),
          User.findOne({username: user_carl}).lean().exec(),
          User.findOne({username: user_anon}).lean().exec()
        ]).then( result =>{
          for( let i = 0; i< result.length; i++){
            expect(result[i]).to.not.exist;
          }
          return next();
        });
      });
    });


});
