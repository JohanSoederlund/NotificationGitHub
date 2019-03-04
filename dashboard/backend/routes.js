"use strict";

const Router = require("koa-router");
const jwt = require('jsonwebtoken');

const websocket = require("./websocket");
const requestPromise = require("./requestpromise");

const SECRET = process.env.SECRET;

const router = new Router();

var cli;
websocket.io.on('connection', (client) => {
  console.log("io.on connection");
  
  cli = client;
  client.on('getUser', token => { 
    var decoded = jwt.verify(token, SECRET);
    console.log("issues on");
    client.emit("user", decoded);

    requestPromise.getOrganizations(decoded.user).then( (res) => {
      //console.log(res);

    }).catch((err) => {
      //console.log(err);
    })
  });
  

  client.on('disconnect', () => {
    console.log("DISCONNECTED");
  });
});

router.get("/webhook", async function (ctx) {
    ctx.response.status = 200;
    //cli.emit
    //console.log(ctx.headers.cookie);
    console.log()
    console.log(ctx.body);
    ctx.body = {
      home: "DASHBOARD HOME"
    };
    
});

router.post("/webhook", async function (ctx) {
  ctx.response.status = 200;
  //cli.emit
  //console.log(ctx.headers.cookie);
  console.log("POST")
  console.log(ctx.body);
  ctx.body = {
    home: "DASHBOARD HOME"
  };
  
});

//export default router;
module.exports = {
    router
}