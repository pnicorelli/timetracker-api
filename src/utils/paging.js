'use strict';

var paging = {

  'getParams': (request)=>{
    let page = ( typeof request.params.page === 'undefined')
      ? 1
      : request.params.page;
    let perPage = ( typeof request.params.per_page === 'undefined')
      ? 20
      : request.params.per_page;

    let result = {
      page: page,
      perPage: perPage
    };

    return result;

  }
};

module.exports = paging;
