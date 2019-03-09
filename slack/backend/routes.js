"use strict";

const Router = require("koa-router");
const jwt = require('jsonwebtoken');
const axios = require('axios');

const websocket = require("./websocket");

const SECRET = process.env.SECRET;

const router = new Router();

var clients = {};
websocket.io.on('connection', (client) => {

  client.on('getUser', token => { 
    var decoded = jwt.verify(token, SECRET);
    clients[decoded.username] = client.id;
    postDatabase(decoded, "user", "get").then( (res) => {
      client.emit("user", res.data);
    }).catch((err) => {
      console.log(err);
    })
    
  });

  client.on('settings', user => { 
    postDatabase(user, "user", "post").then( (res) => {
      client.emit("user", res.data);
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

router.post("/dashboardpayload", async function (ctx) {
  ctx.response.status = 200;
  let user = ctx.request.body.user.user;
  let data = ctx.request.body.user.data;
  let type = "";
  if ("issue" in data) type = "issue";
  else if ("commits" in data) type = "commit";

  //check user settings if event should be posted to slack
  if (findInArray(user.organizations, data.repository.hooks_url, type)) {
    postSlack(user.slackAccessToken, data).then( (res) => {})
    .catch( (err) => {
      console.log(err);
    })
  }
  ctx.body = {};
});

function findInArray(organizations, hooks_url, type) {
  var found = false;
  organizations.forEach( (org) =>  {
    org.hooks.forEach( (hook) =>  {
      if (hook === hooks_url && org[type]) {
        found = true;
      }
    });
  })
  return found;
}

function postDatabase(user, url, method) {
    return new Promise((resolve, reject) => {
        axios({
        method: method,
        url: "http://localhost:3010/"+url,
        data: {
            user: user
        }
        })
        .then((res) => {
            resolve(res);
        })
        .catch((error) => {
            console.log(error);
            reject(error);
        })
        
    });
}

function postSlack(accessToken, data) {
  return new Promise((resolve, reject) => {
    let message = "";
    if ("issue" in data) {
      message = data.action.toUpperCase() + " ISSUE with title: " + data.issue.title + 
      " and body: " + data.issue.body + " from user: " + data.sender.login + " link: " + data.issue.html_url +
      " posted: " + new Date(data.issue.created_at).toUTCString();
    } else if ("commits" in data) {
      message = "NEW COMMIT on repository: " + data.repository.full_name + 
      " and commit message: " + data.commits[0].message + " from user: " + data.head_commit.author.username + 
      " link: " + data.commits[0].url + " pushed: " + new Date(data.commits[0].timestamp).toUTCString();
    }
    let url = "http://slack.com/api/chat.postMessage?token="+accessToken+"&channel="+"U1H386HLL"+"&text="+message;
    axios({
        method: 'post',
        url: url
    })
    .then((res) => {
        resolve(res);
    })
    .catch((error) => {
        reject(error);
    })
  });
}

//export default router;
module.exports = {
    router
}
