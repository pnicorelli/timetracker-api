'use strict';

var Member = require('../../models/Member');
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
    .select('first last labels')
    .paginate(pagingParams.page, pagingParams.perPage, (err, result)=>{
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
      if( err ){
        res.status(400).json( {'message': err.toString()});
        return next();
      }
      let payload = {
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
      .select('first last labels')
      .then( (member)=>{
        res.status(200).json( {'member': member});
        return next();
      })
      .catch( (err)=>{
        res.status(400).json( {'message': err.toString()});
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
        if( err ){
          res.status(400).json( {'message': err.toString()});
          return next();
        }
        if( ! member ){
          res.status(404).json( {'message': 'not found'});
          return next();
        }

        let updateFields = ['first', 'last']; //user can edit only this fields
        for(let key in req.body.member){
          if( updateFields.indexOf(key) > -1){
            member[key] = req.body.member[key];
          }
        }
        member.save( (err, m) => {
          if( err ){
            res.status(400).json( {'message': err.toString()});
            return next();
          }
          res.status(200).json( {'member': member});
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
   * Express Middleware -
   *
   * DEL /v1/accounts/members/:memberId
   */
   'addLabel': (req, res, next) => {
   		Member.remove({userId: req.user._id, _id: req.params.memberId})
      .exec( (err, result)=>{
        if( err ){
          res.status(400).json( {'message': err.toString()});
          return next();
        }
        // if( result.result.ok === result.result.n );
        res.status(204).send();
        return next();
      });
   }




};

module.exports = members;
