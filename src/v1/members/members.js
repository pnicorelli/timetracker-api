'use strict';

var Member = require('../../models/Member');
var MemberToken = require('../../models/MemberToken');

var members = {

  /*
  * Express Middleware - Member Login with password
  *
  * POST /v1/members/login/password
  */
  'login': (req, res, next) => {
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
  * Express Middleware - Member Login with password
  *
  * POST /v1/members/login/password
  */
  'profile': (req, res, next) => {
    let payload = {
      first: req.user.first,
      last: req.user.last,
      email: req.user.email
    };
    res.status(200).json({'member': payload});
    return next();
  }

};

module.exports = members;
