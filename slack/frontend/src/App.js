import React, { Component } from 'react';
import './App.css';
import Cookies from 'js-cookie';
//import socket from './Websocket.js';




let organizations = [];

class App extends Component {

  state = {
    user: {}
  };

  constructor(props) {
    super(props);
    console.log("CONSTRUCTOR");
    console.log(Cookies.get('jwt'));
    //socket.emit("getUser", Cookies.get('jwt'));
    this.state = {
        user: user
    }

    this.onSelect = this.onSelect.bind(this);
    this.renderListItem = this.renderListItem.bind(this);
  }

  componentDidMount() {
/*
    socket.on('user', function(data){
      console.log("user");
      console.log(data);
    }.bind(this));
*/
    user.organizations.forEach(org => {
      organizations.push(org.name);
    });
    this.setState({user: user});
  }

  handleCommitSelect = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    let user = this.state.user;
    for( let i = 0; i < user.organizations.length; i++){
      console.log("LOOP");
      if (user.organizations[i].name === name.slice(1)) {
        user.organizations[i].commit = value;
        break;
      }
    }
    this.setState({
      user: user
    });
    //socket.emit("settings", user);
  }

  handleIssueSelect = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    let user = this.state.user;
    for( let i = 0; i < user.organizations.length; i++){
      console.log("LOOP");
      if (user.organizations[i].name === name.slice(1)) {
        user.organizations[i].issue = value;
        break;
      }
    }
    this.setState({
      user: user
    });
    //socket.emit("settings", user);
  }
  
  render() {

    var organizationRows = [];
    var commitRows = [];
    var issueRows = [];
    this.state.user.organizations.forEach((org) => {
      commitRows.push(<li><label>Commits</label> <input type="checkbox" name={"C"+org.name} onChange={this.handleCommitSelect}></input></li>);
      issueRows.push(<li><label>Issues</label> <input type="checkbox" name={"I"+org.name} onChange={this.handleIssueSelect}></input></li>);
      organizationRows.push(<li> {org.name} </li>);
    });

    return (
      <div className="App">
        <header className="App-header">
          <h1>Notification Hub</h1>
        </header>
        
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


var user = { _id: '5c754a1119349863dac8750d',
  githubId: '21335107',
  username: 'JohanSoederlund',
  githubAccessToken: '',
  slackId: 'U1H386HLL',
  slackAccessToken:
   '',
  __v: 0,
  organizations:
   [ {name: 'JohanSoederlund', commit: false, issue: false, repositories: [ "myproject1", "myproject2", "myproject3", "myproject4", "myproject5", ] },
    {name: '1dv021', commit: true, issue: false, repositories: [ "proj1", "proj2", "proj3", "proj4", "proj5", ]  },
   {name: '1dv022', commit: true, issue: false, repositories: [ "project1", "project2", "project3", "project4", "ject5", ]  },
   {name: '1dv430', commit: true, issue: false, repositories: [ "project1", "prject2", "project3", "projct4", "project5", ]  },
   {name: '1dv023', commit: true, issue: false, repositories: [ "project1", "project2", "project3", "projt4", "project5", ]  },
   {name: '1dv612', commit: true, issue: false, repositories: [ "projct1", "project2", "project3", "project4", "proje5", ]  },
   {name: 'GitHubNotificationHub', commit: true, issue: false, repositories: [ "projct1", "project2", "project3", "project4", "prct5", ]  },
   {name: '1dv611-futurum-project', commit: true, issue: false, repositories: [ "projct1", "projec2", "project", "projec", "project5", ]  }
     ],
  notifications: [] }

