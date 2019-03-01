import io from 'socket.io-client';
/*
const socket = io('https://13.53.201.101/');

socket.on('disconnect', function(){
    console.log("DISCONNECTED");
});
*/


//const socket = io('https://13.53.201.101/');

//var socket = io.connect('https://83.250.202.129/');



//var socket = io.connect('http://localhost'+':'+'3003', {path: '/dashboardwebsocket', resource: 'dashboardwebsocket/socket.io', 'force new connection': true});
var socket = io.connect('https://83.250.202.129:443', {path: '/dashboardwebsocket', resource: 'dashboardwebsocket/socket.io', 'force new connection': true});
//var socket = io.connect('https://83.250.202.129:443');


//var socket = io.connect('http://localhost:3003/');

/*
socket.on('disconnect', function(){
    console.log("DISCONNECTED");
});
*/

export default socket;


