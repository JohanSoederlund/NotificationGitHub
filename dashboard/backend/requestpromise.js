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
            
            resolve(response);
        })
        .catch(function (err) {
            console.log("rp error: " + err);
            reject(err);
        });
    });
}

function getOrganizations(username) {

    console.log("GETORGANIZATIONS");
    console.log(username);
    return new Promise((resolve, reject) => {
        postDatabase({ username: username }, "user", "get").then( (user) => {
            console.log(user.data);

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
                        Authorization: 'token ' + user.data.githubAccessToken,
                        content_type: "json",
                        secret: SECRET,
                    },
                },
                headers: {
                    Accept: "application/vnd.github.v3+json",
                    Authorization: 'token ' + user.data.githubAccessToken,
                    'User-Agent': 'Request-Promise'
                }
            }
            
            rp(options)
            .then(function (response) {
                var databaseUser = user.data;
                databaseUser["organizations"] = [user.data.username];

                createHook("GET", user.data, "https://api.github.com/users/"+user.data.username+"/repos").then( (res) => {
                    res.forEach(element => {
                        createHook("POST", user.data, element.hooks_url).then( (res) => {
                            console.log("CREATE PUBLIC HOOK RESPONSE");
                            console.log(res);
                        }).catch( (err) => {
                            console.log("ERROR POST HOOK");
                        })
                    })
                }).catch( (err) => {
                    console.log("ERROR");
                })
                /*
                response.forEach(element => {
                    
                    databaseUser["organizations"].push(element.login);
                    createHook("GET", user.data, element.hooks_url).then( (res) => {
                        console.log("Hook for " + element.hooks_url + " already exist.");
                    }).catch( (err) => {
                        createHook("POST", user.data, element.hooks_url).then( (res) => {
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
                    resolve(user.data);
                }).catch( (err) => {
                    console.log("POST to database ERROR in RP");
                    console.log(err);
                });
                */
            })
            .catch(function (err) {
                console.log("rp error: " + err);
                reject(err);
            });
            

        }).catch( (err) => {
            console.log(err);
        })
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
