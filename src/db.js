'use strict';

var mongoose = require('mongoose');
var config = require('config');
var Promise = require('bluebird');

var params = config.get('database');

mongoose.Query.prototype.paginate = function paginate (page, limit, cb) {
  page = parseInt(page, 10) || 1;
  limit = parseInt(limit, 10) || 10;

  var query = this;
  var model = this.model;
  var skipFrom = (page * limit) - limit;

  query = query.skip(skipFrom).limit(limit);

  if(cb) {
    query.exec(function(err, docs) {
      if(err) {
        cb(err, null, null);
      } else {
        model.count(query._conditions, function(err, total) {
          let result = {
            data: docs,
            total: total,
            page: page,
            perPage: limit
          };
          if(err) {
            cb(err, null, null);
          } else {
            cb(null, result);
          }
        });
      }
    });
  } else {
    return this;
  }
};

var db = {

  connect(){
    mongoose.Promise = Promise;
    if ( mongoose.connection.readyState < 1 ) {
      this._conn = mongoose.connect(params.url);
    }
  },

  close(){
    return this._conn.disconnect();// mongoose.connection.close();
  }

};

module.exports = db;
