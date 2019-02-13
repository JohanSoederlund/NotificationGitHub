"use strict";

const Router = require("koa-router");
const ObjectID = require("mongodb").ObjectID;
const jwt = require('jsonwebtoken');

const DatabaseManager = require("../database/databaseManager");
const UserModel = require("../database/userModel");

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

router.get("/user", async function (ctx) {
    


    try {
        //await DatabaseManager.findUser({user: ctx.request})
        await DatabaseManager.findUser({username: "JohanSoederlund"})
        .then((user, success) => {
            ctx.body = user.value;
            if (success) {
                ctx.response.status = 200;
            } else {
                ctx.response.status = 400;
            }
        })
    } catch (error) {
        ctx.response.status = 400;
        ctx.body = error;
    }
    
});

router.post("/user", async function (ctx) {
    
    try {
        let user = new UserModel(ctx.request.body);
        await DatabaseManager.saveNewUser(user)
        .then( (result) => {
            ctx.body = result.value;
            if (result.success) {
                ctx.response.status = 201;
            } else {
                ctx.response.status = 400;
            }
        });
    } catch (error) {
        ctx.response.status = 400;
        ctx.body = error;
    }
    
});

router.patch("/user", async function (ctx) {
    try {
        let home = ctx.request.body;
        //home.user = ctx.state.user.user;
        //home = new DatabaseModel(ctx.request.body);
        await DatabaseManager.saveNewHome(ctx.request.body)
        .then( (result) => {
            ctx.body = result.value;
            ctx.body.links = {login: "/login", register: "/register", homes: "/homes", home: "/homes/:id"};
            if (result.success) {
                ctx.body.links[result.value.name] = "/homes/" + result.value._id;
                ctx.response.status = 201;
            } else {
                ctx.response.status = 400;
            }
        });
    } catch (error) {
        ctx.response.status = 400;
        ctx.body = error;
    }
});


/**
 * For development reasons, remove in production
 */
router.get("/drop", async function (ctx) {
    ctx.response.status = 307;
    await DatabaseManager.dropCollection("users").then( (result) => {
        ctx.redirect('/');
    })
});

//export default router;
module.exports = {
    router
}
