import React, { Component } from 'react';
import './App.css';
import Cookies from 'js-cookie';
import socket from './Websocket.js';

let organizations = [];

const settingsURL = "https://13.53.201.101/settings/"
const dashboardURL = "https://13.53.201.101/dashboard/"

class App extends Component {

  state = {
    user: {}
  };

  constructor(props) {
    super(props);
    socket.emit("getUser", Cookies.get('jwt'));
    this.state = {
      user: { 
        username: '',
        organizations:
        [],
        notifications: [] 
      }
    }
    this.handleCommitSelect = this.handleCommitSelect.bind(this);
    this.handleIssueSelect = this.handleIssueSelect.bind(this);
  }

  componentDidMount() {
    socket.on('user', function(data){
      data.organizations.forEach(org => {
        organizations.push(org.name);
      });
      this.setState({user: data});
    }.bind(this));
  }

  handleCommitSelect = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    let user = this.state.user;
    for( let i = 0; i < user.organizations.length; i++){
      if (user.organizations[i].name === name.slice(1)) {
        user.organizations[i].commit = value;
        break;
      }
    }
    this.setState({
      user: user
    });
    socket.emit("settings", user);
  }

  handleIssueSelect = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    let user = this.state.user;
    for( let i = 0; i < user.organizations.length; i++){
      if (user.organizations[i].name === name.slice(1)) {
        user.organizations[i].issue = value;
        break;
      }
    }
    this.setState({
      user: user
    });
    socket.emit("settings", user);
  }
  
  render() {
    var organizationRows = [];
    var commitRows = [];
    var issueRows = [];
    this.state.user.organizations.forEach((org) => {
      commitRows.push(<li><label>Commits</label> <input type="checkbox" name={"C"+org.name} onChange={this.handleCommitSelect} checked={org.commit}></input></li>);
      issueRows.push(<li><label>Issues</label> <input type="checkbox" name={"I"+org.name} onChange={this.handleIssueSelect} checked={org.issue}></input></li>);
      organizationRows.push(<li> {org.name} </li>);
    });

    return (
      <div className="App">
        <header className="App-header">
          <h1>Notification Hub</h1>
        </header>

        <div className="topBar">
          <div className="split2">
            <a className="navLink" href={settingsURL}>⚙️</a>
            <a className="navLink" href={dashboardURL}>📋</a>
          </div>
        </div>
        
        <div className="settings">
          <h2>Settings for Slack notifications</h2>

          <ul className="organizations">
            {organizationRows}
          </ul>

          <ul className="commitBoxes">
          {commitRows}
          </ul>

          <ul className="issueBoxes">
            {issueRows}
          </ul>
        </div>

      </div>
    );
  }
}

export default App;
