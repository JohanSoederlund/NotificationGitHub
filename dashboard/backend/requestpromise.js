"use strict";
const rp = require('request-promise');
const axios = require('axios');

const SECRET = process.env.SECRET;
const URL = process.env.URL;


function createHook(method, user, url) {

    //'https://api.github.com/repos/1dv023/js223zs-examination-3/hooks'
    //'https://api.github.com/orgs/1dv612/hooks'
    //'https://api.github.com/orgs/GitHubNotificationHub/hooks'
    var options = {
        method: method,
        uri: url,
        secure: true,
        json: true,
        body: {
            name: "web",
            active: true,
            events: ["issues", "push"],
            config: {
                insecure_ssl: "1",
                Authorization: 'token ' + user.githubAccessToken,
                url: "https://"+URL+"/webhook",
                content_type: "json",
                secret: SECRET,
            },
        },
        headers: {
            Accept: "application/vnd.github.v3+json",
            Authorization: 'token ' + user.githubAccessToken,
            'User-Agent': 'Request-Promise'
        }
    }
    return new Promise((resolve, reject) => {
        rp(options)
        .then(function (response) {
            console.log("response in createHook");
            //console.log(response);
            //var gitHubUser = {githubId: user.githubId, username: user.username, accessToken: user.accessToken, webHooks: response.url};
            //console.log(response);
            /*
            postDatabase(user, "user", "post").then( (result) => {
              }).catch ( (err)=> {console.log("postToDatabase ERROR");});
              */
            resolve(response);
        })
        .catch(function (err) {
            console.log("rp error: " + err);
            reject(err);
        });
    });
}

function getOrganizations(user) {

    var options = {
        method: "GET",
        uri: 'https://api.github.com/user/orgs',
        secure: true,
        json: true,
        body: {
            name: "web",
            active: true,
            
            config: {
                insecure_ssl: "1",
                Authorization: 'token ' + user.githubAccessToken,
                content_type: "json",
                secret: SECRET,
            },
        },
        headers: {
            Accept: "application/vnd.github.v3+json",
            Authorization: 'token ' + user.githubAccessToken,
            'User-Agent': 'Request-Promise'
        }
    }
    return new Promise((resolve, reject) => {
        rp(options)
        .then(function (response) {
            var databaseUser = user;
            databaseUser["organizations"] = [];
            response.forEach(element => {
                databaseUser["organizations"].push(element.login);
                createHook("GET", user, element.hooks_url).then( (res) => {
                    console.log("Hook for " + element.hooks_url + " already exist.");
                }).catch( (err) => {
                    createHook("POST", user, element.hooks_url).then( (res) => {
                        console.log("CREATE HOOK RESPONSE");
                        console.log(res);
                    }).catch( (err) => {
                        console.log("ERROR POST HOOK");
                        console.log(element.hooks_url);
                    })
                })
            });
            
            postDatabase(databaseUser, "user", "post").then( () => {
                console.log("POST to database success in RP");
            }).catch( (err) => {
                console.log("POST to database ERROR in RP");
                console.log(err);
            });
            
        })
        .catch(function (err) {
            console.log("rp error: " + err);
            reject(err);
        });
    });
}

function postDatabase(user, url, method) {
    return new Promise((resolve, reject) => {
        axios({
        method: method,
        url: "http://localhost:3010/"+url,
        data: {
            user: user
        }
        })
        .then((res) => {
            resolve(res);
        })
        .catch((error) => {
            console.log(error);
            reject(error);
        })
        
    });
}

function postSlack(user, url, method) {
    return new Promise((resolve, reject) => {
        axios({
        method: method,
        url: "http://localhost:3009/"+url,
        data: {
            user: user
        }
        })
        .then((res) => {
            resolve(res);
        })
        .catch((error) => {
            console.log(error);
            reject(error);
        })
        
    });
}

module.exports = {
    getOrganizations,
    postDatabase,
    postSlack
}
