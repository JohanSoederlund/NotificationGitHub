"use strict";

const Koa = require("koa");
const BodyParser = require("koa-bodyparser");
const logger = require('koa-logger');
const helmet = require("koa-helmet");
const fs = require("fs");
const http2 = require("http2");
const kJwt = require('koa-jwt');

const DatabaseManager = require("../database/databaseManager");
const router = require("../app/routes");

const app = new Koa();

/**
 * Change to node var in production
 */
const SECRET = "shared-secret";


app.use(BodyParser());
app.use(logger());
app.use(helmet());

const options = {
    key: fs.readFileSync('/home/johan/studier/1DV527/ssl/selfsigned.key'),
    cert: fs.readFileSync('/home/johan/studier/1DV527/ssl/selfsigned.crt'),
};

DatabaseManager.connectDatabase();

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
app.use(kJwt({ secret: SECRET }).unless({ path: [/^\//, /^\/user/] }));

app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, HEAD');
    ctx.set({accept: 'application/json'});
    await next();
})

app.use(router.router.routes()).use(router.router.allowedMethods(options));

app.listen(process.env.PORT || 3010);

const server = http2.createSecureServer(options, app.callback());

//server.listen(process.env.PORT || 443);