"use strict";

const Router = require("koa-router");
const jwt = require('jsonwebtoken');
const axios = require('axios');

const websocket = require("./websocket");

const SECRET = process.env.SECRET;

const router = new Router();

//Every active client
var clients = {};

/**
 * New client connections.
 */
websocket.io.on('connection', (client) => {

  /**
   * Client fetches connected user.
   * jwt is verified for security.
   */
  client.on('getUser', token => { 
    var decoded = jwt.verify(token, SECRET);
    clients[decoded.username] = client.id;
    postDatabase(decoded, "user", "get").then( (res) => {
      client.emit("user", res.data);
    }).catch((err) => {
      console.log(err);
    })
    
  });

  /**
   * Client fetches user-settings.
   */
  client.on('settings', user => { 
    jwt.verify(user.token, SECRET);
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

/**
 * Payload from internal api call, originally from GitHub webhook.
 */
router.post("/dashboardpayload", async function (ctx) {
  ctx.response.status = 200;
  let user = ctx.request.body.user.user;
  let data = ctx.request.body.user.data;
  let type = "";
  if ("issue" in data) type = "issue";
  else if ("commits" in data) type = "commit";

  //check user settings if event should be posted to slack
  if (findInArray(user.organizations, data, type)) {
    postSlack(user.slackAccessToken, data).then( (res) => {})
    .catch( (err) => {
      console.log(err);
    })
  }
  ctx.body = {};
});

/**
 * Checks that user-settigs match url and type
 * @param {Array} organizations 
 * @param {Object} data payload data
 * @param {string} type payload type
 */
function findInArray(organizations, data, type) {
  var found = false;
  
  organizations.forEach( (org) =>  {
    org.hooks.forEach( (hook) =>  {
      if (data.organization !== undefined) {
        if (data.organization.login === org.name && org[type]) {
          found = true;
        }
      } else {
        if (hook === data.repository.hooks_url && org[type]) {
          found = true;
        }
      }
    });
  })
  return found;
}

/**
 * Internal api call to update or fetch a user.
 * @param {Object} user 
 * @param {string} url 
 * @param {string} method 
 */
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
            reject(error);
        })
        
    });
}

/**
 * Post a message to Slack application through slackbot channel.
 * @param {string} accessToken 
 * @param {object} data 
 */
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
