"use strict";

const Router = require("koa-router");
const ObjectID = require("mongodb").ObjectID;
const jwt = require('jsonwebtoken');

const DatabaseManager = require("../database/databaseManager");
const UserModel = require("../database/userModel");

const router = new Router();

/**
 * Internal api route for a user.
 */
router.get("/user", async function (ctx) {
    try {
        await DatabaseManager.findUser({username: ctx.request.body.user.username})
        .then((result) => {
            ctx.body = result.value;
            if (result.success) {
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

/**
 * Internal api route to save new or update a user.
 */
router.post("/user", async function (ctx) {
    try {
        let usr = ctx.request.body.user;
        if (usr["_id"] !== undefined) {
            delete usr["_id"]; 
        }
        ctx.body = usr;

        await DatabaseManager.saveNewUser(usr)
        .then( (result) => {
            ctx.body = result.value;
            if (result.success) {
                ctx.response.status = 201;
            } else {
                ctx.response.status = 200;
            }
        });
        
    } catch (error) {
        ctx.response.status = 400;
        ctx.body = error;
    }
});

/**
 * Internal api route to delete old notifications from a user.
 */
router.delete("/user", async function (ctx) {
    try {
        let usr = ctx.request.body.user;
        if (usr["_id"] !== undefined) {
            delete usr["_id"]; 
        }
        ctx.body = usr;
        let user = new UserModel(usr);

        await DatabaseManager.deleteNotifications(user)
        .then( (result) => {
            ctx.body = result.value;
            if (result.success) {
                ctx.response.status = 200;
            } else {
                ctx.response.status = 200;
            }
        });
        
    } catch (error) {
        ctx.response.status = 400;
        ctx.body = error;
    }
});

/**
 * Internal api route to get all users.
 */
router.get("/users", async function (ctx) {
    try {
        await DatabaseManager.findUsers()
        .then((result) => {
            ctx.body = result.value;
            if (result.success) {
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

/**
 * For development reasons, remove in production
 */
router.get("/drop", async function (ctx) {
    ctx.response.status = 307;
    await DatabaseManager.dropCollection("users").then( (result) => {
        ctx.body = {ok: "ok"};
    })
});

//export default router;
module.exports = {
    router
}
