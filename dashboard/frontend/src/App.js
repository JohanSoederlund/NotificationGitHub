import React, { Component } from 'react';
import './App.css';
import Cookies from 'js-cookie';
import socket from './Websocket.js';

import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'

import Notification from './Notification'

const settingsURL = "https://13.53.201.101/settings/"
const dashboardURL = "https://13.53.201.101/dashboard/"

class App extends Component {

  constructor(props) {
    super(props);
    socket.emit("getUser", Cookies.get('jwt'));
    this.state = { user: {organizations: [""],notifications: []}, 
    selectedOption: "", showNotification: false, showDropDown: false, selected: [], redirect: false};
    this.onSelect = this.onSelect.bind(this);
  }

  componentDidMount() {

    socket.on('user', (data) => {
      let user = {githubId: data.githubId,
      username: data.username, organizations:[], notifications: data.notifications };
      data.organizations.forEach( (org) => {
        user.organizations.push(org.name);
      })
      this.setState({user: user, organizations: user.organizations, selectedOption: user.organizations[0], showDropDown: true}, function(){
        this.setState(this.state);
      }.bind(this) );
    })

    socket.on('notification', (data) => {
      let user = this.state.user;
      user.notifications.push(data);

      let notes = [];
      this.state.user.notifications.forEach( (notification) => {
        if (notification.organization === this.state.selectedOption) notes.push(notification);
      })
      this.setState({user: user, notifications: notes, showNotification: true}, function(){
        this.setState(this.state);
      }.bind(this) );
    })

    this.setState(this.state);
  }

  onSelect = (event) => {
    let notes = [];
    this.state.user.notifications.forEach( (notification) => {
      if (notification.organization === event.value) notes.push(notification);
    })
    this.setState({
      notifications: notes,
      selectedOption: event.value,
      showNotification: true
    }, function(){
      this.setState(this.state);
    }.bind(this));
  }
 
  render() {
    let showNotification = this.state.showNotification;
    let showDropDown = this.state.showDropDown;
    let notification;
    let dropDown;
    if (showDropDown) {
      dropDown = <Dropdown options={this.state.user.organizations} onChange={this.onSelect} value={this.state.selectedOption} placeholder="Select an option" />
    }
    if (showNotification) {
      notification = <Notification tiers={this.state.notifications}/>
    } 

    
    return (
      <div className="App">
        <header className="App-header">
          <h1>Notification Hub</h1>
        </header>
          
        <div className="topBar">
          <div className="split1">
            {dropDown}
          </div>
          <div className="split2">
            <a className="navLink" href={settingsURL}>⚙️</a>
            <a className="navLink" href={dashboardURL}>📋</a>
          </div>
        </div>

        {notification}
      </div>
    );
  }
}

export default App;


