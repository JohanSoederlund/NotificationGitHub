import io from 'socket.io-client';

var socket = io.connect('https://13.53.201.101:443', {path: '/slackwebsocket', resource: 'slackwebsocket/socket.io', 'force new connection': true});

export default socket;


