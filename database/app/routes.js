"use strict";

const Router = require("koa-router");
const ObjectID = require("mongodb").ObjectID;
const jwt = require('jsonwebtoken');

const DatabaseManager = require("../database/databaseManager");
const UserModel = require("../database/userModel");

const SECRET = process.env.SECRET;

const router = new Router();

router.get("/user", async function (ctx) {
    console.log(".get /user");
    console.log(ctx.request.body);
    try {
        await DatabaseManager.findUser({user: ctx.request.body.user.username})
        .then((result) => {
            ctx.body = result.value;
            if (result.success) {
                ctx.response.status = 200;
            } else {
                console.log(JSON.stringify(result));
                ctx.response.status = 400;
            }
        })
    } catch (error) {
        console.log(error);
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
        
        await DatabaseManager.updateUser(ctx.request.body)
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
