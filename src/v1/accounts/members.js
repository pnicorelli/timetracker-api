'use strict';

var cfg = require('config');

var Member = require('../../models/Member');
var MemberAccessCode = require('../../models/MemberAccessCode');

var paging = require('../../utils/paging');

var members = {

  /*
  * Express Middleware - Get all members
  *
  * GET /v1/accounts/:userId/members
  */
  'getAll': (req, res, next) => {
    let pagingParams = paging.getParams(req);
    Member.find({userId: req.user._id})
    .select('first last email labels')
    .paginate(pagingParams.page, pagingParams.perPage, (err, result)=>{
      /* istanbul ignore if */
      if( err ){
        res.status(400).json( {'message': err.toString()});
        return next();
      }
      res.status(200).json(result);
      return next();
    });

  },

  /*
  * Express Middleware - Get all members
  *
  * POST /v1/accounts/:userId/members
  */
  'create': (req, res, next) => {
    if( !req.body.member ){
      res.status(400).json({'message': 'required fields missing'});
      return next();
    }
    let member = new Member(req.body.member);
    member.userId = req.user._id;
    member.save( (err, m) => {
      /* istanbul ignore if */
      if( err ){
        res.status(400).json( {'message': err.toString()});
        return next();
      }
      let payload = {
        _id: m._id,
        email: m.email,
        first: m.first,
        last: m.last
      };
      res.status(201).json( {'member': payload});
      return next();
    });
  },

  /*
  * Express Middleware - read a member
  *
  * GET /v1/accounts/members/:memberId
  */
  'getOne': (req, res, next) => {
    Member.findOne({userId: req.user._id, _id: req.params.memberId})
    .select('first last email labels password')
    .exec( (err, member)=>{
      /* istanbul ignore if */
      if( err ){
        res.status(400).json( {'message': err.toString()});
        return next();
      }
      res.status(200).json( {'member': member});
      return next();
    });
  },

  /*
  * Express Middleware - Update  a memeber
  *
  * PUT /v1/accounts/members/:memberId
  */
  'updateOne': (req, res, next) => {
    Member.findOne({userId: req.user._id, _id: req.params.memberId})
    .exec( (err, member)=>{
      /* istanbul ignore if */
      if( err ){
        res.status(400).json( {'message': err.toString()});
        return next();
      }
      /* istanbul ignore if */
      if( !member ){
        res.status(404).json( {'message': 'not found'});
        return next();
      }

      let updateFields = ['first', 'last', 'email']; //user can edit only this fields
      for(let key in req.body.member){
        if( updateFields.indexOf(key) > -1){
          member[key] = req.body.member[key];
        }
      }
      member.save( (err, m) => {
        /* istanbul ignore if */
        if( err ){
          res.status(400).json( {'message': err.toString()});
          return next();
        }
        let payload = {
          _id: member._id,
          password: member.password,
          labels: member.labels,
          email: member.email,
          last: member.last,
          first: member.first
        };
        res.status(200).json( {'member': payload});
        return next();
      });
    });
  },



  /*
  * Express Middleware -
  *
  * DEL /v1/accounts/members/:memberId
  */
  'deleteOne': (req, res, next) => {
    Member.remove({userId: req.user._id, _id: req.params.memberId})
    .exec( (err, result)=>{
      /* istanbul ignore if */
      if( err ){
        res.status(400).json( {'message': err.toString()});
        return next();
      }
      // if( result.result.ok === result.result.n );
      res.status(204).send();
      return next();
    });
  },




  /*
  * Express Middleware - Create a member's code for login (it expire in model.createdAt.exprire seconds)
  *
  * POST /v1/accounts/members/:memberId/code
  */
  'createCode': (req, res, next) => {
    Member.findOne({userId: req.user._id, _id: req.params.memberId}).exec( (err, member) => {
      if( err ){
        res.status(400).json( {'message': err.toString()});
        return next();
      }
      if( !member ){
        res.status(404).json( {'message': 'member not found'});
        return next();
      }
      let ac = new MemberAccessCode();
      ac.create(member, (err, code)=>{
        if( err ){
          res.status(400).json( {'message': err.toString()});
          return next();
        }
        res.status(201).json({
          'code': code,
          'last': cfg.database.codeExpireTime
        });
        return next();
      });
    });
  }

};

module.exports = members;
