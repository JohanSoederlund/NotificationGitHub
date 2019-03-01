"use strict";

const Koa = require("koa");
const BodyParser = require("koa-bodyparser");
const logger = require('koa-logger');
const helmet = require("koa-helmet");
const kJwt = require('koa-jwt');

const router = require("./routes");

const app = new Koa();

const SECRET = process.env.SECRET;
const PORT = process.env.SECRET;

app.use(BodyParser());
app.use(logger());
app.use(helmet());

// Custom 401 handling if you don't want to expose koa-jwt errors to users
app.use(function(ctx, next){
    return next().catch((err) => {
      if (401 == err.status) {
        ctx.status = 401;
        ctx.body = 'Protected resource, use Authorization header to get access\n';
      } else {
        throw err;
      }
    });
});

//In production remove /^\//,
//app.use(kJwt({ secret: SECRET }).unless({ path: [/^\//, /^\/dashboard/]}));

app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Methods', 'GET, POST');
    ctx.set({accept: 'application/json'});
    await next();
})

app.use(router.router.routes()).use(router.router.allowedMethods());





const IO = require( 'koa-socket.io' )
const http = require('http');
 
 
//const app = new Koa()
const io = new IO({
  namespace: 'webhook'
})
  
//app.use( ... )
 
let options = {
  /* socket.io options */

}
 
var server = http.createServer(app.callback());
 
io.start( server, options, PORT, /*host */ )

io.on('connection', client => {
  console.log("io.on connection");
});

io.on('webhook', client => {
  console.log("webhook");
});

io.on('connection', function* () {
  console.log('join event receiverd, new user: ', this.data)

  // use global io send borad cast
  io.emit('msg', '[All]: ' + this.data + ' joind'); 

  // use current socket send a broadcast
  this.socket.broadcast('msg', '[All]: Hello guys, I\'m ' + this.data + '.'); 
  
   // just send to current user
  this.socket.emit('msg', '[' + this.data + ']' + " Welcome to koa-socket.io !");
})


io.on('join', function* () {
    console.log('join event receiverd, new user: ', this.data)
 
    // use global io send borad cast
    io.emit('msg', '[All]: ' + this.data + ' joind'); 
 
    // use current socket send a broadcast
    this.socket.broadcast('msg', '[All]: Hello guys, I\'m ' + this.data + '.'); 
    
     // just send to current user
    this.socket.emit('msg', '[' + this.data + ']' + " Welcome to koa-socket.io !");
})























app.listen(process.env.PORT || 3003);

