'use strict';

var Member = require('../../models/Member');
var MemberToken = require('../../models/MemberToken');
var MemberAccessCode = require('../../models/MemberAccessCode');

var members = {

  /*
  * Express Middleware - Member Login with password
  *
  * POST /v1/members/login/password
  */
  'loginWithPassword': (req, res, next) => {
    let password = (req.body.password)?req.body.password:'';
    Member.findOne({password: password}).exec( (err, m)=>{
      if( err ){
        res.status(400).json({ 'message': err.toString() });
        return next();
      }
      if( !m ){
        res.status(404).json({ 'message': 'member not found' });
        return next();
      }
      let at = new MemberToken();
      at.create(m, (err, token)=>{
        /* istanbul ignore if */
        if( err ){
          res.status(400).json({ 'message': err.toString() });
          return next();
        }
        res.status(201).json({ 'token': token});
        return next();
      });
    });
  },

  /*
  * Express Middleware - Member Login with code
  *
  * POST /v1/members/login/code
  */
  'loginWithCode': (req, res, next) => {
    let code = (req.body.code)?req.body.code:'';
    MemberAccessCode.findOne({code: code}).lean().exec( (err, mac)=>{
      if( err ){
        res.status(400).json({ 'message': err.toString() });
        return next();
      }
      if( !mac ){
        res.status(404).json({ 'message': 'member not found' });
        return next();
      }
      MemberAccessCode.remove({_id: mac._id}).exec();
      Member.findOne({_id: mac.memberId}).exec( (err, member)=>{
        if( err ){
          res.status(400).json({ 'message': err.toString() });
          return next();
        }
        if( !member ){
          res.status(404).json({ 'message': 'member not found' });
          return next();
        }
        let at = new MemberToken();
        at.create(member, (err, token)=>{
          /* istanbul ignore if */
          if( err ){
            res.status(400).json({ 'message': err.toString() });
            return next();
          }
          res.status(201).json({ 'token': token});
          return next();
        });
      });
    });
  },

  /*
  * Express Middleware - Member Login with password
  *
  * POST /v1/members/login/password
  */
  'profile': (req, res, next) => {
    Member.find({_id: req.user._id})
      .populate('userId', 'company')
      .exec(
        (err, result) =>{
          if( err ){
            res.status(400).json({ 'message': err.toString() });
            return next();
          }
          if( !result ){
            res.status(404).json({ 'message': 'member not found' });
            return next();
          }
          let payload = {
            first: result[0].first,
            last: result[0].last,
            email: result[0].email,
            company: result[0].userId.company
          };
          res.status(200).json({'member': payload});
          return next();
        }
      );
  }

};

module.exports = members;
