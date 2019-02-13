"use strict";

const Koa = require("koa");
const BodyParser = require("koa-bodyparser");
const logger = require('koa-logger');
const helmet = require("koa-helmet");
const fs = require("fs");
const http2 = require("http2");
const kJwt = require('koa-jwt');

const session = require('koa-session');
const passport = require('koa-passport');

//const router = require("./routes");
const Router = require("koa-router");
const router = new Router();

const app = new Koa();

/**
 * Change to node var in production
 */
const SECRET = "shared-secret";

app.use(BodyParser());
app.use(logger());
app.use(helmet());

// required for cookie signature generation
app.keys = ['newest secret key', 'older secret key'];
app.use(session(app));
//app.use(session({ signed: false }, app));
app.use(passport.initialize());
app.use(passport.session());


var GitHubStrategy = require('passport-github').Strategy;

const GITHUB_CLIENT_ID = "";
const GITHUB_CLIENT_SECRET = "";


var user;
passport.use(new GitHubStrategy({
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  callbackURL: "http://localhost:3004/auth"
},
function(accessToken, refreshToken, profile, cb) {
  console.log("accessToken: "+accessToken+ "\nrefreshToken: "+refreshToken+"\nprofile: "+ JSON.stringify(profile)+"\ncb: "+ cb);
 
  user = {githubId: profile.id, username: profile.username, accessToken: accessToken};
  return cb(null, user);

  //return cb(new Error("error i return cb"), user);
  /*
  User.findOrCreate({ githubId: profile.id }, function (err, user) {
    return cb(err, user);
  });
  */
}
));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

const options = {
    key: fs.readFileSync('/home/johan/studier/1DV612/ssl/selfsigned.key'),
    cert: fs.readFileSync('/home/johan/studier/1DV612/ssl/selfsigned.crt'),
};

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

router.get("/", async function (ctx) {
  ctx.response.status = 200;
  ctx.body = {
    home: "DASHBOARD HOME",
    user: user
  };
  
});

router.get("/login", passport.authenticate('github'));

router.get("/auth", passport.authenticate('github'), async function (ctx) {
    //console.log("ctx auth: "+JSON.stringify(ctx));
    ctx.redirect('/');
});

//app.use(router.router.routes()).use(router.router.allowedMethods(options));
app.use(router.routes()).use(router.allowedMethods(options));

app.listen(process.env.PORT || 3004);

const server = http2.createSecureServer(options, app.callback());

//server.listen(process.env.PORT || 443);
