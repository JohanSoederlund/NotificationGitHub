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
  ctx.body = {
    cookies: ctx.cookies.get("jwt")
  };
});


router.get("/settings", async function (ctx) {
    ctx.response.status = 200;
    
    console.log(ctx.headers.cookie);

    ctx.body = {
      home: "settings HOME"
    };
    
});


//export default router;
module.exports = {
    router
}