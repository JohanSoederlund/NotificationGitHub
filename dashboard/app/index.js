"use strict";

const Koa = require("koa");
const BodyParser = require("koa-bodyparser");
const logger = require('koa-logger');
const helmet = require("koa-helmet");
const kJwt = require('koa-jwt');

const router = require("../app/routes");

const app = new Koa();

const SECRET = process.env.SECRET;

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
app.use(kJwt({ secret: SECRET }).unless({ path: [/^\//, /^\/dashboard/]}));

app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Methods', 'GET, POST');
    ctx.set({accept: 'application/json'});
    await next();
})

app.use(router.router.routes()).use(router.router.allowedMethods(options));

app.listen(process.env.PORT || 3002);
