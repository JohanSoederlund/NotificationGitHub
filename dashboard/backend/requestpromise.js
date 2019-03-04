"use strict";
var rp = require('request-promise');

const SECRET = process.env.SECRET;
const URL = process.env.URL;

function createHook(user, url) {

    //'https://api.github.com/repos/1dv023/js223zs-examination-3/hooks'
    var options = {
        method: "POST",
        uri: 'https://api.github.com/repos/1dv023/js223zs-examination-3/hooks',
        secure: true,
        json: true,
        body: {
            name: "web",
            active: true,
            events: ["issues", "releases", "commits"],
            config: {
                insecure_ssl: "1",
                Authorization: 'token ' + user.accessToken,
                url: "https://"+URL+"/webhook",
                content_type: "json",
                secret: SECRET,
            },
        },
        headers: {
            Accept: "application/vnd.github.v3+json",
            Authorization: 'token ' + user.accessToken,
            'User-Agent': 'Request-Promise'
        }
    }
    return new Promise((resolve, reject) => {
        rp(options)
        .then(function (response) {
            console.log("response in createHook");
            //console.log(response);
            //var gitHubUser = {githubId: user.githubId, username: user.username, accessToken: user.accessToken, webHooks: response.url};
            resolve(response);
        })
        .catch(function (err) {
            console.log("rp error: " + err);
            reject(err);
        });
    });
}

function getOrganizations(user) {
//Authorization: 'token ' + user.githubAccessToken,
console.log(user.username);
console.log(user.githubAccessToken);
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
                //url: "https://"+URL+"/webhook",
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
            console.log("response");
            //console.log(response);
            console.log(response[4].hooks_url);
            
            
            getrepos(user, response[4].repos_url).then( (res) => {
                console.log("GET REPOS RESPONSE");
                console.log(res[1].url+'/hooks');
                createHook(user, res[1].url+'/hooks').then( (res) => {
                    console.log("CREATE HOOK RESPONSE");
                    console.log(res);
                }).catch( (err) => {
                    console.log("ERROR HOOK");
                })

            }).catch( (err) => {
                
            })
            
        })
        .catch(function (err) {
            console.log("rp error: " + err);
            reject(err);
        });
    });
}

function getrepos(user, url) {

    console.log(user.username);
    console.log(user.githubAccessToken);
        var options = {
            method: "GET",
            uri: url,
            secure: true,
            json: true,
            body: {
                name: "web",
                active: true,
                
                config: {
                    insecure_ssl: "1",
                    Authorization: 'token ' + user.githubAccessToken,
                    //url: "https://"+URL+"/webhook",
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
                console.log("response in get repos");
                resolve(response);
            })
            .catch(function (err) {
                console.log("rp error: " + err);
                reject(err);
            });
        });
    }

module.exports = {
    createHook,
    getOrganizations,
    getrepos
}
