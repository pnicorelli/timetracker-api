'use strict';

var paging = {

  'getParams': (request)=>{
    let page = ( typeof request.query.page === 'undefined')
      ? 1
      : request.query.page;
    let perPage = ( typeof request.query.perPage === 'undefined')
      ? 20
      : request.query.perPage;

    let result = {
      page: page,
      perPage: perPage
    };

    return result;

  }
};

module.exports = paging;
