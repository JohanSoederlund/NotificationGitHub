"use strict";

const Router = require("koa-router");
const jwt = require('jsonwebtoken');
const axios = require('axios');

const websocket = require("./websocket");

const SECRET = process.env.SECRET;

const router = new Router();

var clients = {};
websocket.io.on('connection', (client) => {
  console.log("io.on connection");

  client.on('getUser', token => { 
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkpvaGFuU29lZGVybHVuZCIsImlhdCI6MTU1MjA0MDQ1NiwiZXhwIjoxNTUyMTI2ODU2fQ.L7yvkm6LeIlUxixctR_DRA2rFxrXWGrx7fDfVMYnCck";
    var decoded = jwt.verify(token, SECRET);
    console.log("issues on");
    client.emit("user", decoded);
    clients[decoded.user.username] = client.id;
    
    
    postDatabase(decoded, "users", "get").then( (res) => {
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

router.post("/dashboardpayload", async function (ctx) {
  ctx.response.status = 200;
  let user = ctx.request.body.user.user;
  let data = ctx.request.body.user.data;
  //check user settings if event should be posted to slack
  let usersettings = true;
  if (usersettings) {
    postSlack(user.slackAccessToken, data).then( (res) => {
      console.log(res);
    }).catch( (err) => {
      console.log(err);
    })
  }
  ctx.body = {};
});

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