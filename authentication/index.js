"use strict";

const axios = require('axios');
const Koa = require("koa");
const BodyParser = require("koa-bodyparser");
const logger = require('koa-logger');
const helmet = require("koa-helmet");
const kJwt = require('koa-jwt');
const jwt = require('jsonwebtoken');
const decode = require('koa-jwt-decode');

const session = require('koa-session');
const passport = require('koa-passport');
var GitHubStrategy = require('passport-github').Strategy;

const Router = require("koa-router");
const router = new Router();

const SECRET = process.env.SECRET;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

const app = new Koa();

const cors = require('@koa/cors');
const koaOptions = {
  origin: 'https://172.17.0.1',
  credentials: true
};
app.use(cors(koaOptions));
app.use(BodyParser());
app.use(logger());
app.use(helmet());

// required for cookie signature generation
app.keys = [SECRET, 'older secret key'];

app.use(session(app));
//app.use(session({ signed: false }, app));
app.use(passport.initialize());
app.use(passport.session({
  secret: SECRET,
  cookie: {
      path: '/',
      domain: 'https://172.17.0.1',
      maxAge: 1000 * 60 * 24 // 24 hours
  }
}));

var user;
//todo: add more scopes
passport.use(new GitHubStrategy({
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  callbackURL: "https://172.17.0.1/auth",
  scope: 'repo'
},
function(accessToken, refreshToken, profile, cb) {
  user = {githubId: profile.id, username: profile.username, accessToken: accessToken};
  return cb(null, user);
  getDatabase(user, "user").then( (result) => {
    console.log("result: ");
    console.log(result.config.data.user);
    return cb(null, result.config.data.user);
  });
}
));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

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
app.use(kJwt({ secret: SECRET }).unless({ path: [/^\//, /^\/auth/, /^\/login/]}));

app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Methods', 'GET, POST');
    ctx.set({accept: 'application/json'});
    await next();
})

router.get("/login", passport.authenticate('github'));

router.get("/auth", passport.authenticate('github'), async function (ctx) {
    var token = jwt.sign({ user: user }, SECRET, {expiresIn: '62d'});
    ctx.cookies.set("jwt", token, {httpOnly: false, domain: "172.17.0.1"});
    ctx.redirect('https://172.17.0.1/dashboard');
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(process.env.PORT || 3004);

/**
 * Helper API functions
 * @param {signed in user} user 
 * @param {database server sub-url} url 
 */
function postDatabase(user, url) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: "http://localhost:3010/"+url,
      data: {
        user: user
      }
    })
    .then((res) => {
      resolve(res);
      console.log(`statusCode: ${res.statusCode}`)
      console.log(res)
    })
    .catch((error) => {
      reject(error);
        console.error(error)
    })
    
  });
}

function getDatabase(user, url) {
  console.log(user);
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: "http://localhost:3010/"+url,
      data: {
        user: user
      }
    })
    .then((res) => {
      resolve(res);
      console.log(`statusCode: ${res.statusCode}`)
      console.log(res)
    })
    .catch((error) => {
      reject(error);
        console.error(error)
    });
  });
}

module.exports = {
  passport
}