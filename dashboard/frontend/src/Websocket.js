import io from 'socket.io-client';

var socket = io.connect('https://13.53.201.101:443', {path: '/dashboardwebsocket', resource: 'dashboardwebsocket/socket.io', 'force new connection': true});

export default socket;
