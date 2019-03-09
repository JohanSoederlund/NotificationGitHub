"use strict";

const axios = require('axios');
const Koa = require("koa");
const BodyParser = require("koa-bodyparser");
const logger = require('koa-logger');
const helmet = require("koa-helmet");
const jwt = require('jsonwebtoken');

const session = require('koa-session');
const passport = require('koa-passport');
const GitHubStrategy = require('passport-github2').Strategy;
const SlackStrategy = require('passport-slack').Strategy;

const Router = require("koa-router");
const router = new Router();

const SECRET = process.env.SECRET;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const SLACK_CLIENT_ID = process.env.SLACK_CLIENT_ID;
const SLACK_CLIENT_SECRET = process.env.SLACK_CLIENT_SECRET
const PORT = process.env.PORT;
const URL = process.env.URL;

const app = new Koa();

const cors = require('@koa/cors');
const koaOptions = {
  origin: 'https://'+URL+'/',
  credentials: true
};
app.use(cors(koaOptions));
app.use(BodyParser());
app.use(logger());
app.use(helmet());

// required for cookie signature generation
app.keys = [SECRET, 'older secret key'];

app.use(session(app));
app.use(passport.initialize());
app.use(passport.session({
  secret: SECRET,
  cookie: {
      path: '/',
      domain: 'https://'+URL,
      maxAge: 1000 * 60 * 24 // 24 hours
  }
}));

var user;

passport.use(new GitHubStrategy({
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  callbackURL: "https://"+URL+"/auth",
  scope: ["admin:org_hook", "repo"]
},
function(githubAccessToken, refreshToken, profile, cb) {
  user = {githubId: profile.id, username: profile.username, githubAccessToken: githubAccessToken, slackId: "", slackAccessToken: ""};
  return cb(null, user);
}
));

/**
 * Share Your App with Your Workspace
 * https://slack.com/oauth/authorize?client_id=3143650568.560770539555&scope=incoming-webhook,chat:write:bot
 */
passport.use(new SlackStrategy({
  clientID: SLACK_CLIENT_ID,
  clientSecret: SLACK_CLIENT_SECRET,
  scope: ['chat:write:user']
}, (slackAccessToken, refreshToken, profile, done) => {
  user.slackId = profile.user.id;
  user.slackAccessToken = slackAccessToken;
  postDatabase(user, "user", "post").then( (result) => {
    done(null, result.data);
  }).catch ( (err)=> {
    done(new Error("Could not save to db, slack"), profile);
  } )
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


app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Methods', 'GET, POST');
    ctx.set({accept: 'application/json'});
    await next();
})

router.get("/login", passport.authenticate('github'));

router.get("/auth", passport.authenticate('github'), async function (ctx) {
    ctx.redirect('https://'+URL+'/auth/slack');
});

router.get('/auth/slack', passport.authorize('slack'));

router.get('/auth/slack/callback', 
  passport.authorize('slack', { failureRedirect: '/auth/slack' }), async function (ctx) {
    var token = jwt.sign({ username: user.username }, SECRET, {expiresIn: "1d"});
    ctx.cookies.set("jwt", token, {httpOnly: false, domain: URL});
    ctx.redirect('https://'+URL+'/dashboard');
  });

app.use(router.routes()).use(router.allowedMethods());

app.listen(process.env.PORT || 3004);

/**
 * Helper API functions
 * @param {signed in user} user 
 * @param {database server sub-url} url 
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

module.exports = {
  passport
}