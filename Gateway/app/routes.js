"use strict";

const Router = require("koa-router");
const jwt = require('jsonwebtoken');
const axios = require('axios');
//const request = require('request');
const request = require('request-promise-native')

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

router.get("/dashboard", async function (ctx) {
    const uri = `http://localhost:3002`
    //ctx.redirect(`http://localhost:3002`);
    ctx.body =  await request(uri)
    /*
    ctx.response.status = 200;
   
    ctx.body = await request(uri)
    */
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

function routeService(service, method) {
    return new Promise((resolve, reject) => {
    axios({
        method:'get',
        url:service
        //,
        //responseType:'application/json'
      })
        .then(function(response) {
        resolve(response);
        //    response.data.pipe(fs.createWriteStream('ada_lovelace.jpg'))
      });
    })

    /*
    return new Promise((resolve, reject) => {
        axios.get(service).then( (res) => {
            resolve(res);
        })
        .catch((error) => {
            console.error(error)
            reject(error);
        })
    })

    
    axios.post(user.webhookCallback, {
        newHome: newHome
    })
    .then((res) => {
        console.log(`statusCode: ${res.statusCode}`)
        console.log(res)
    })
    .catch((error) => {
        console.error(error)
    })
    */
}


//export default router;
module.exports = {
    router
}