"use strict";

const Router = require("koa-router");
const jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET;

const router = new Router();

/**
 * Every route below.
 */
router.get("/", async function (ctx) {
  ctx.response.status = 200;
  var token = ctx.cookies.get("jwt");
  var decoded = jwt.verify(token, SECRET);
  console.log(decoded);
  ctx.body = {
    cookies: ctx.cookies.get("jwt"),
    decoded: decoded
  };
});


router.get("/dashboard", async function (ctx) {
    ctx.response.status = 200;
    
    console.log(ctx.headers.cookie);

    ctx.body = {
      home: "DASHBOARD HOME"
    };
    
});


//export default router;
module.exports = {
    router
}