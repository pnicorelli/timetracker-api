'use strict'

var mongoose = require('mongoose');
var config = require('config');
var Promise = require('bluebird');

var params = config.get('database');

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

}

module.exports = db;
