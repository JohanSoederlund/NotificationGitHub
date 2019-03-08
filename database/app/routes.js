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
    //console.log(ctx.request.body.user.username);
    try {
        await DatabaseManager.findUser({username: ctx.request.body.user.username})
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
        console.log("POST /user");
        let usr = ctx.request.body.user;
        if (usr["_id"] !== undefined) {
            delete usr["_id"]; 
        }
        ctx.body = usr;
        
        let user = new UserModel(usr);
        await DatabaseManager.saveNewUser(user)
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

router.delete("/user", async function (ctx) {
    
    try {
        console.log("DELETE /user");
        let usr = ctx.request.body.user;
        if (usr["_id"] !== undefined) {
            delete usr["_id"]; 
        }
        ctx.body = usr;
        let user = new UserModel(usr);
        await DatabaseManager.deleteNotifications(user)
        .then( (result) => {
            console.log(result);
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

router.get("/users", async function (ctx) {
    console.log(".get /users");
    try {
        await DatabaseManager.findUsers()
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
