"use strict";

const Router = require("koa-router");
const jwt = require('jsonwebtoken');
const axios = require('axios');

/*
var GitHubStrategy = require('passport-github').Strategy;
var passport = require('passport');

const GITHUB_CLIENT_ID = "179451e5ba9314472772";
const GITHUB_CLIENT_SECRET = "d9710287b4d37b5f9be6f13308a4a81ee8f4f7cb";

passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3004/auth"
    //callbackURL: "http://127.0.0.1:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log("accessToken: "+accessToken+ "\nrefreshToken: "+refreshToken+"\nprofile: "+ profile+"\ncb: "+ cb);
   */
   
    /*
    User.findOrCreate({ githubId: profile.id }, function (err, user) {
      return cb(err, user);
    });
    */

    /*
  }
));
*/

/**
 * Change to node var in production
 */
const SECRET = "shared-secret";

const router = new Router();

/**
 * Every route below.
 */
router.get("/", async function (ctx) {
  ctx.response.status = 200;
  ctx.body = {
    home: "DASHBOARD HOME"
  };
  
});

router.get("/login", passport.authenticate('github'), async function (ctx) {
  console.log("ctx: "+ctx);
  ctx.response.status = 200;
  ctx.body = {
    home: "login"
  };
  
});


router.get("/auth", passport.authenticate('github'), async function (ctx) {
    console.log("ctx: "+ctx);
    ctx.response.status = 200;
    ctx.body = {
      home: "auth"
    };
    
});


//export default router;
module.exports = {
    router
}