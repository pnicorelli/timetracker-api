'use strict';

var User = require('../../models/User');
var AccessToken = require('../../models/AccessToken');

var testTools = require('../../utils/test-tools');

var accounts = {

  /*
  * Express Middleware - DESCRIPTION
  *
  * METHOD /v1/endpoint
  */
  'profile': (req, res, next) => {
    let payload = {
      _id: req.user._id,
      username: req.user.username,
      company: req.user.company
    };
    res.json({ 'profile': payload });
    return next();
  },



  /*
  * Express Middleware - Signup a new user
  *
  * POST /v1/accounts/signup
  */
  'signup': (req, res, next) => {
    let username = (req.body.username)?req.body.username:false;
    let password = (req.body.password)?req.body.password:false;
    let company = (req.body.company)?req.body.company:false;

    if(  !username  ){
      res.status(400).json({ 'message': 'invalid username'});
      return next();
    }
    if(  !password  ){
      res.status(400).json({ 'message': 'invalid password'});
      return next();
    }
    if(  !company  ){
      res.status(400).json({ 'message': 'invalid company'});
      return next();
    }
    let newUser = new User({
      username: username,
      password: password,
      company: company
    });
    newUser.save( (err, u)=>{

      /* istanbul ignore if */
      if( err ){
        res.status(400).json({ 'message': err.toString() });
        return next();
      }
      let at = new AccessToken();
      at.create(u._id, (err, token)=>{
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
  * Express Middleware - DESCRIPTION
  *
  * POST /v1/accounts/login
  */
  'login': (req, res, next) => {
    let username = (req.body.username)?req.body.username:'';
    let password = (req.body.password)?req.body.password:'';

    User.findOne({username: username})
    .exec( (err, u) => {
      /* istanbul ignore if */
      if( err ){
        res.status(400).json({ 'message': err.toString() });
        return next();
      }
      if( !u ){
        res.status(404).json({ 'message': 'user not found' });
        return next();
      }

      u.checkPassword(u.password, password, (result)=>{

        if( result ){
          let at = new AccessToken();
          at.create(u._id, (err, token)=>{
            /* istanbul ignore if */
            if( err ){
              res.status(400).json({ 'message': err.toString() });
              return next();
            }
            res.status(201).json({ 'token': token});
            return next();
          });
        } else {
          res.status(404).json({ 'message': 'user not found' });
          return next();
        }
      });
    });
  },

  /*
  * Express Middleware - DESCRIPTION
  *
  * DELETE  /v1/accounts/delete
  */
  'remove': (req, res, next) => {
    testTools.removeUserAccess(req.user.username)
    .then(
      (result)=>{
        res.status(204).send();
        return next();
      },
      (reject)=>{
        res.status(400).json({ 'message': reject.toString() });
        return next();
      });
    }


  };


  module.exports = accounts;
