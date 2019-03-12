"use strict";

const Router = require("koa-router");
const jwt = require('jsonwebtoken');

const websocket = require("./websocket");
const requestPromise = require("./requestpromise");

const SECRET = process.env.SECRET;

const router = new Router();

var clients = {};
websocket.io.on('connection', (client) => {
  
  client.on('getUser', token => { 
    var decoded = jwt.verify(token, SECRET);
    clients[decoded.username] = client.id;
    
    requestPromise.getOrganizations(decoded.username).then( (res) => {
      client.emit("user", res);
      requestPromise.postDatabase(decoded, "user", "delete").then( (res) => {}).catch((err) => {
        console.log(err);
      })
    }).catch((err) => {
      console.log(err);
    })
  });

  client.on('disconnect', () => {
    for (var key in clients) {
      if (clients[key] === client.id) {
        delete clients[key];
        break;
      } 
    }
  });
});

router.post("/webhook", async function (ctx) {
  ctx.response.status = 200;
  let data = ctx.request.body;
  if (data.organization === undefined) {
    requestPromise.postDatabase({username: data.repository.owner.login}, "user", "get").then( (user) => {
      if (clients.hasOwnProperty(data.repository.owner.login)) sendToDashboard(data.repository.owner.login, data);
      else sendToSlack(user.data, data);
    })
    
  } else {
    requestPromise.postDatabase({}, "users", "get").then( (users) => {
      users.data.forEach(user => {
        user.organizations.forEach( (org) => {
          if (org.name === data.organization.login) {
            if (clients.hasOwnProperty(user.username)) sendToDashboard(user.username, data);
            else sendToSlack(user, data);
          }
        })
      });
    }).catch((err)=> {
      console.log(err);
    })
  }
  ctx.body = {};
});

function sendToDashboard(username, data) {
  if ("issue" in data) {
    websocket.io.sockets.clients().sockets[clients[username]].emit("notification", createIssue(data));
  } else if ("commits" in data) {
    websocket.io.sockets.clients().sockets[clients[username]].emit("notification", createCommit(data) );
  }
}

function sendToSlack(user, data) {
  if (user.notifications === undefined) {
    user.notifications = [];
  }
  if ("issue" in data) {
    user.notifications.push(createIssue(data));
  } else if ("commits" in data) {
    user.notifications.push(createCommit(data));
  }
  
  requestPromise.postDatabase(user, "user", "post").then( (user) => {
  }).catch( (err) => {
    console.log(err);
  })
  
  requestPromise.postSlack({user, data}, "dashboardpayload", "post").then( (res) => {
  }).catch((err) => {
    console.log(err);
  })
}

function createIssue(data) {
  return {
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
    created_at: new Date(data.issue.created_at).toUTCString(),
    organization: data.repository.owner.login
  }
}

function createCommit(data) {
  return {
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
    created_at: new Date(data.commits[0].timestamp).toUTCString(),
    organization: data.repository.owner.login
  }
}

//export default router;
module.exports = {
    router
}
