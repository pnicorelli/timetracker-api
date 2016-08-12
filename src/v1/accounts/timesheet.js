'use strict';

var Member = require('../../models/Member');
var TimeSheet = require('../../models/TimeSheet');
var ObjectId = require('mongoose').Types.ObjectId;

var paging = require('../../utils/paging');

var timesheet = {

  /*
  * Express Middleware - Read TimeSheet
  *
  * GET /v1/members/timesheet
  */
  'getAll': (req, res, next) => {
    let pagingParams = paging.getParams(req);
    let sortingParams = (req.query.sort)?req.query.sort: { 'from': -1};

    let query = {};

    if(req.query.from){
      query['from'] = { '$gte': new Date(req.query.from) };
    }

    if(req.query.to){
      query['$or'] = [ { 'to': {'$lte': new Date(req.query.to)} }, { 'to': null} ];
    }

    if(req.query.memberId){
      query['memberId'] = new ObjectId(req.query.memberId);
    }

    if(req.query.status){
      query['status'] = req.query.status;
    }

    let sort = {};
    for( let field in sortingParams){
      sort[field] = sortingParams[field];
    }
    query['userId'] = req.user._id;

    TimeSheet.find(query)
    .select('memberId from to status duration')
    .sort(sort)
    .paginate(pagingParams.page, pagingParams.perPage, (err, result)=>{
      /* istanbul ignore if */
      if( err ){
        res.status(400).json( {'message': err.toString()});
        return next();
      }
      res.status(200).json(result);
      return next();
    });
  }

};

module.exports = timesheet;
