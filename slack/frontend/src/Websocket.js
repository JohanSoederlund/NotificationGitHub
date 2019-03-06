import io from 'socket.io-client';

var socket = io.connect('https://83.250.202.129:443', {path: '/slackwebsocket', resource: 'slackwebsocket/socket.io', 'force new connection': true});

export default socket;


