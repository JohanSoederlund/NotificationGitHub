"use strict";

const axios = require('axios');
const Koa = require("koa");
const BodyParser = require("koa-bodyparser");
const logger = require('koa-logger');
const helmet = require("koa-helmet");
const fs = require("fs");
const http2 = require("http2");
const kJwt = require('koa-jwt');
const jwt = require('jsonwebtoken');
const decode = require('koa-jwt-decode');

const session = require('koa-session');
const passport = require('koa-passport');

//const router = require("./routes");
const Router = require("koa-router");
const router = new Router();

const app = new Koa();

/**
 * const SECRET = process.env.SECRET;
 */
const SECRET = "shared-secret";

app.use(BodyParser());
app.use(logger());
app.use(helmet());

//npm i cors?
//app.use(cors({credentials:true}))

// required for cookie signature generation
app.keys = ['newest secret key', 'older secret key'];
app.use(session(app));
//app.use(session({ signed: false }, app));
app.use(passport.initialize());
app.use(passport.session());


var GitHubStrategy = require('passport-github').Strategy;

/**
 * const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
 * const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
 */
const GITHUB_CLIENT_ID = "179451e5ba9314472772";
const GITHUB_CLIENT_SECRET = "d9710287b4d37b5f9be6f13308a4a81ee8f4f7cb";


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

//, decode({ secret: SECRET })
router.get("/", async function (ctx) {
  //console.log(this.session);
  console.log("\n\n\nreq");
  console.log(ctx.request);
  console.log("\n\n\n");
  ctx.response.status = 200;
  ctx.body = {
    home: "DASHBOARD HOME",
    user: user
  };
  
});

router.get("/login", passport.authenticate('github'));

router.get("/auth", passport.authenticate('github'), async function (ctx) {
    var tok = jwt.sign({ user: user }, SECRET, {expiresIn: '62d'});
    /*
    const options = {
      headers: { Authorization: `Bearer ${tok}` }
      //headers: { Authorization: `Bearer ${ctx.session.passport.user.access_token}` }
    }
    ctx.headers = { Authorization: `Bearer ${ctx.session.passport.user.access_token}` }
*/


    const options = {
      headers: { Authorization: `Bearer ${tok}` },
      json: true,
      method: 'GET',
      uri: "http://172.17.0.1/dashboard"
    }
    const response = await rp(options)
    ctx.body = JSON.stringify(response)
    ctx.redirect("http://172.17.0.1/dashboard", options);

});

//app.use(router.router.routes()).use(router.router.allowedMethods(options));
app.use(router.routes()).use(router.allowedMethods(options));

app.listen(process.env.PORT || 3004);

const server = http2.createSecureServer(options, app.callback());

//server.listen(process.env.PORT || 443);


function postDatabase(user) {
  axios.post("http://localhost:3010", {
      user
  })
  .then((res) => {
      console.log(`statusCode: ${res.statusCode}`)
      console.log(res)
  })
  .catch((error) => {
      console.error(error)
  })
}

