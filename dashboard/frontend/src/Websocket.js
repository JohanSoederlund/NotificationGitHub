import io from 'socket.io-client';

var socket = io.connect('https://83.250.202.129:443', {path: '/dashboardwebsocket', resource: 'dashboardwebsocket/socket.io', 'force new connection': true});

export default socket;
