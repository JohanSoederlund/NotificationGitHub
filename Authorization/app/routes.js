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
      home: "HOME"
    };
    
});

router.post("/register", async function (ctx) {
    ctx.response.status = 200;
    ctx.body = {
        home: "REGISTER"
      };
});

router.get("/login", async function (ctx) {
    ctx.response.status = 200;
    ctx.body = {
        home: "LOGIN"
      };
});

router.post("/login", async function (ctx) {
    ctx.response.status = 200;
    ctx.body = {
        home: "LOGIN"
      };
});



//export default router;
module.exports = {
    router
}