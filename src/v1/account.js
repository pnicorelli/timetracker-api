'use strict'

var User = require('../models/User');
var AccessToken = require('../models/AccessToken');

var account = {

  /*
  * Express Middleware - Signup a new user
  *
  * POST /v1/account/signup
  */
  'signup': (req, res, next) => {
    let username = (req.body.username)?req.body.username:false;
    let password = (req.body.password)?req.body.password:false;

    if(  !username  ){
      res.status(400).json({ 'message': 'invalid username'});
      return next();
    }
    if(  !password  ){
      res.status(400).json({ 'message': 'invalid password'});
      return next();
    }
    let newUser = new User({
      username: username,
      password: password
    });
    newUser.save( (err, u)=>{

      if( err ){
        res.status(400).json({ 'message': err.toString() });
        return next();
      }
      let at = new AccessToken();
      at.create(u._id, (err, token)=>{
        if( err ){
          res.status(400).json({ 'message': err.toString() });
          return next();
        }
        res.status(201).json({ 'token': token});
        return next();
      });
    })
  },



  /*
   * Express Middleware - DESCRIPTION
   *
   * POST /v1/account/login
   */
   'login': (req, res, next) => {
     let username = (req.body.username)?req.body.username:'';
     let password = (req.body.password)?req.body.password:'';

     User.findOne({username: username})
      .exec( (err, u) => {
        if( err ){
          res.status(400).json({ 'message': err.toString() });
          return next();
        }
        if( !u ){
          res.status(404).json({ 'message': 'user not found' });
          return next();
        }

        u.checkPassword(u.password, password, (err, result)=>{
          if( err ){
            res.status(400).json({ 'message': err.toString() });
            return next();
          }

          if( result ){
            let at = new AccessToken();
            at.create(u._id, (err, token)=>{
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
        })
      });
   }


}


module.exports = account;
