const server = require('http').createServer();

var io = require('socket.io').listen(server, {path: '/dashboardwebsocket', resource: 'dashboardwebsocket/socket.io'});

server.listen(3003);

module.exports = {
  io
}
