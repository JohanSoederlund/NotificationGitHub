"use strict";

const Router = require("koa-router");
const jwt = require('jsonwebtoken');

const websocket = require("./websocket");
const requestPromise = require("./requestpromise");

const SECRET = process.env.SECRET;

const router = new Router();

var clients = {};
websocket.io.on('connection', (client) => {
  console.log("io.on connection");

  client.on('getUser', token => { 
    var decoded = jwt.verify(token, SECRET);
    console.log("issues on");
    client.emit("user", decoded);
    clients[decoded.user.username] = client.id;
    
    requestPromise.getOrganizations(decoded.user).then( (res) => {
      //console.log(res);
    }).catch((err) => {
      //console.log(err);
      
    })
  });
  

  client.on('disconnect', () => {
    console.log(clients);
    console.log("DISCONNECTED");
    for (var key in clients) {
      if (clients[key] === client.id) {
        delete clients[key];
        break;
      } 
    }
    console.log(clients);
  });
});

router.post("/webhook", async function (ctx) {
  ctx.response.status = 200;
  let data = ctx.request.body;
  console.log(clients);
  console.log(data.organization.login);
  requestPromise.postDatabase({}, "users", "get").then( (users) => {
    console.log(users.data);
    

    users.data.forEach(user => {
      console.log(user);
      if (user.organizations.includes(data.organization.login)) {
        console.log(true);
        if (clients.hasOwnProperty(user.username)) sendToDashboard(user.username, data);
        else sendToSlack(user, data);
        
        //for ( var property in clients ) {
          //console.log("FOR");
          //if (property === user.username) sendToDashboard(user.username, data);
          //else sendToSlack(user, data);
        //}
        //if (property === user.username) sendToDashboard(user.username, data);
      }
    });
  }).catch((err)=> {
    console.log("DATABAS FEL");
  })

  ctx.body = {};
});


function sendToDashboard(username, data) {
  console.log("ISSUE");
  if ("issue" in data) {
    websocket.io.sockets.clients().sockets[clients[username]].emit("issue", {
      action: data.action.toUpperCase(),
      event: 'ISSUE',
      title: data.issue.title,
      subheader: data.issue.body,
      user: data.sender.login,
      user_html_url: data.sender.html_url,
      description: [],
      buttonText: 'Github link',
      buttonVariant: 'contained',
      html_url: data.issue.html_url,
      avatar_url: data.issue.user.avatar_url+".jpg",
      created_at: new Date(data.issue.created_at).toUTCString()
    });
  } else if ("commits" in data) {
    websocket.io.sockets.clients().sockets[clients[username]].emit("commit", {
      action: "NEW ",
      event: 'COMMIT',
      title: data.repository.full_name,
      subheader: data.commits[0].message,
      user: data.head_commit.author.username,
      user_html_url: data.sender.html_url,
      description: [],
      buttonText: 'Github link',
      buttonVariant: 'contained',
      html_url: data.commits[0].url,
      avatar_url: data.sender.avatar_url+".jpg",
      created_at: new Date(data.commits[0].timestamp).toUTCString()
    });
  }
}

function sendToSlack(user, body) {
  console.log("SEND TO SLACK");
}


//export default router;
module.exports = {
    router
}