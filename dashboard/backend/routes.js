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
  console.log(data.organization.login);
  //check with database which users have data.organization.login
  for ( var property in clients ) {
    postDatabase({username: property}, "user", "get").then( (user) => {
      if (user.organizations.includes(data.organization.login)) {
        if ("issue" in ctx.request.body) {
          websocket.io.sockets.clients().sockets[clients["JohanSoederlund"]].emit("issue", {
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
        } else if ("commits" in ctx.request.body) {
          websocket.io.sockets.clients().sockets[clients["JohanSoederlund"]].emit("commit", {
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
    }).catch( (err) => {
  
    });
  }
  
  ctx.body = {};
});

//export default router;
module.exports = {
    router
}