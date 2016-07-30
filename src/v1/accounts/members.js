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
  }

};

module.exports = members;
