'use strict';

var Suggestion = require('../../models/Suggestion');


var suggestions = {


/*
 * Express Middleware - create a suggestion
 *
 * POST /v1/members/suggestions
 */
 'create': (req, res, next) => {

   let message = (req.body.message)?req.body.message:null;
   if( !message ){
     res.status(400).json( {'message': 'message is mandatory'});
     return next();
   }
 		let s = new Suggestion();
    s.userId = req.user.userId;
    s.memberId = req.user._id;
    s.message = message;
    s.save( (err, suggestion)=>{
      if(err){
        res.status(400).json( {'message': err.toString()});
        return next();
      }
      res.status(201).json( {'message': 'thank you'});
      return next();
    });
 }

};

module.exports = suggestions;
