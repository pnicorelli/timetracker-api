'use strict'

var server = require('./src/server.js');

//APP START
server.start();

process.on('SIGINT', (code) => {
  server.close( ()=>{
    process.exit();
  });
});
