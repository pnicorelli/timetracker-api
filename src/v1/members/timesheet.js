'use strict';

var Member = require('../../models/Member');
var TimeSheet = require('../../models/TimeSheet');

var paging = require('../../utils/paging');

var timesheet = {

  /*
  * Express Middleware - Read TimeSheet
  *
  * GET /v1/members/timesheet
  */
  'getAll': (req, res, next) => {
    let pagingParams = paging.getParams(req);
    let filterParams = (req.query.filter)?req.query.filter:null;
    let sortingParams = (req.query.sort)?req.query.sort: { 'from': -1};

    let query = {};
    for( let field in filterParams){
      query[field] = filterParams[field];
    }

    let sort = {};
    for( let field in sortingParams){
      sort[field] = sortingParams[field];
    }
    query['userId'] = req.user.userId;
    query['memberId'] = req.user._id;

    TimeSheet.find(query)
    .select('from to status duration')
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
  },

  /*
  * Express Middleware - Read TimeSheet
  *
  * POST /v1/members/timesheet
  */
  'create': (req, res, next) => {
    let newTs = new TimeSheet;

    newTs.start( req.user ).then( (ts) =>{
      res.status(201).json( { 'timesheet': {
        _id: ts._id,
        from: ts.from,
        to: ts.to,
        status: ts.status
      }});
      return next();
    }).catch( (err) => {
      res.status(400).json( { 'message': err.toString()} );
      return next();
    });

  },

  /*
  * Express Middleware - Read TimeSheet
  *
  * GET /v1/members/timesheet/:timesheetId
  */
  'getOne': (req, res, next) => {
    TimeSheet.findOne({_id: req.params.timesheetId, userId: req.user.userId, memberId: req.user._id})
    .select('from to status createdAt duration')
    .exec( (err, time)=>{
      /* istanbul ignore if */
      if( err ){
        res.status(400).json( {'message': err.toString()});
        return next();
      }
      res.status(200).json( {'timesheet': time});
      return next();
    });
  },

  /*
  * Express Middleware - Close TimeSheet
  *
  * PUT /v1/members/timesheet/:timesheetId
  */
  'closeOne': (req, res, next) => {
    TimeSheet.findOne({_id: req.params.timesheetId, userId: req.user.userId, memberId: req.user._id})
    .exec( (err, time)=>{
      /* istanbul ignore if */
      if( err ){
        res.status(400).json( {'message': err.toString()});
        return next();
      }
      if( !time ){
        res.status(404).json( {'message': 'time not found'});
        return next();
      }
      time.setClose()
        .then( ( timesheet )=>{
          res.status(200).json( {'timesheet': {
            _id: timesheet._id,
            from: timesheet.from,
            to: timesheet.to,
            duration: timesheet.duration,
            status: timesheet.status
          }});
          return next();
        })
        .catch( (err)=>{
          res.status(400).json( {'message': err.toString()});
          return next();
        });
    });
  },

  /*
  * Express Middleware - Delete TimeSheet
  *
  * DELETE /v1/members/timesheet/:timesheetId
  */
  'delete': (req, res, next) => {
    TimeSheet.remove({_id: req.params.timesheetId, userId: req.user.userId, memberId: req.user._id})
    .then( (response)=>{
      if( response.result.ok === 1){
        res.status(204).json();
        return next();
      } else {
        res.status(404).json( {'message': 'time not found'});
        return next();
      }
    })
    .catch( (err)=>{
      res.status(400).json( {'message': err.toString()});
      return next();
    });
  }

};

module.exports = timesheet;
