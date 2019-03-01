const server = require('http').createServer();

//const index = require('./index');
//const io = require('socket.io')(server);
var io = require('socket.io').listen(server, {path: '/dashboardwebsocket', resource: 'dashboardwebsocket/socket.io'});

var nsp = io.of('/webhook');
nsp.on('connection', function(socket){
  console.log('someone connected');
});



io.on('connection', client => {
  console.log("io.on connection");
  cli = client;
  
  client.on('notification', user => { 
    console.log("notification on");
    var res = "test notification";
    client.emit("notification", res);
  });

  client.on('issues', user => { 
    var res = "test issues";
    console.log("issues on");
    client.emit("issues", res);
  });
  

  client.on('disconnect', () => {
    console.log("DISCONNECTED");
  });
});


server.listen(3003);

module.exports = {
  io
}
