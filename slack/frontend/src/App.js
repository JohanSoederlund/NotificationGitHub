import React, { Component } from 'react';
import './App.css';
import Cookies from 'js-cookie';
//import socket from './Websocket.js';

import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';


let organizations = [];
let options = [
  
]
const defaultOption = options[0];

class App extends Component {

  constructor(props) {
    super(props);
    
    console.log("CONSTRUCTOR");
    console.log(Cookies.get('jwt'));
    //socket.emit("getUser", Cookies.get('jwt'));
    this.state = {
        jwt: Cookies.get('jwt')
    }
  }

  componentDidMount() {
/*
    socket.on('user', function(data){
      console.log("user");
      console.log(data);
    }.bind(this));
*/
    options = user.organizations;
    this.setState({});
  }

  _onSelect() {
    this.setState({});
  }
 
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Notification Hub</h1>
        </header>
        <div className="menu">
          <Dropdown className="dropdown" options={options} onChange={this._onSelect} value={defaultOption} placeholder="Select an organization" />

        </div>
        
      </div>
    );
  }
}

export default App;




var user = { _id: '5c754a1119349863dac8750d',
  githubId: '21335107',
  username: 'JohanSoederlund',
  githubAccessToken: '',
  slackId: 'U1H386HLL',
  slackAccessToken:
   '',
  __v: 0,
  organizations:
   [ '1dv021',
     '1dv022',
     '1dv430',
     '1dv023',
     '1dv612',
     'GitHubNotificationHub',
     '1dv611-futurum-project' ],
  notifications: [] }

