"use strict";

const Router = require("koa-router");
const jwt = require('jsonwebtoken');

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


router.get("/dashboard", async function (ctx) {
    ctx.response.status = 200;
    ctx.body = {
      home: "DASHBOARD HOME"
    };
    
});


//export default router;
module.exports = {
    router
}