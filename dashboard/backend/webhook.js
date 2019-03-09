"use strict";
var rp = require('request-promise');

const DatabaseManager = require('./database/databaseManager');

const SECRET = process.env.SECRET;
const URL = process.env.URL;

function createHook(user) {

    var options = {
        method: "POST",
        uri: 'https://api.github.com/repos/1dv023/js223zs-examination-3/hooks',
        secure: true,
        json: true,
        body: {
            name: "web",
            active: true,
            events: ["issues"],
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
            var gitHubUser = {githubId: user.githubId, username: user.username, accessToken: user.accessToken, webHooks: response.url};
            DatabaseManager.updateUser(gitHubUser).then( (res) => {
                resolve(response);
            })
            .catch(function (err) {
                reject(err);
            });
        })
        .catch(function (err) {
            reject(err);
        });
    });
}

module.exports = {
    createHook
}
