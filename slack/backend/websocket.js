const server = require('http').createServer();

var io = require('socket.io').listen(server, {path: '/slackwebsocket', resource: 'slackwebsocket/socket.io'});

server.listen(3005);

module.exports = {
  io
}
