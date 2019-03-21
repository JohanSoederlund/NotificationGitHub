"use strict";
const rp = require('request-promise');
const axios = require('axios');

const SECRET = process.env.SECRET;
const URL = process.env.URL;

/**
 * Creates a webhook or an api call with options based on verb, user-profile and url.
 * @param {string} method 
 * @param {Object} user 
 * @param {string} url 
 */
function createHook(method, user, url) {

    var options = getOptions(method, user, url, ["issues", "push"]);
    
    return new Promise((resolve, reject) => {
        rp(options)
        .then(function (response) {
            resolve(response);
        })
        .catch(function (err) {
            reject(err);
        });
    });
}

/**
 * Fetches organizations.
 * Sets up new hooks.
 * Updates user profile.
 * @param {string} username 
 */
function getOrganizations(username) {
    return new Promise((resolve, reject) => {
        postDatabase({ username: username }, "user", "get").then( (user) => {
            var options = getOptions("GET", user.data, "https://api.github.com/user/orgs");
            rp(options)
            .then(function (orgResponse) {
                
                var databaseUser = user.data;
                //Users public repos will always have index 0 in organizations array
                if (databaseUser.organizations.length === 0) databaseUser["organizations"] = [ { name: user.data.username, commit: true, issue: true, hooks: [] }];
                
                createHook("GET", user.data, "https://api.github.com/users/"+user.data.username+"/repos").then( (publicRepoResponse) => {
                    
                    let missingHooksUrls = findInArray(databaseUser, publicRepoResponse);
                    missingHooksUrls.forEach( (element) => {
                        databaseUser.organizations[0].hooks.push(element);
                    })
                    
                    missingHooksUrls.forEach(element => {
                        createHook("POST", user.data, element).then( (res) => {})
                        .catch( (err) => {
                            console.log(err);
                        })
                    })
                    
                    orgResponse.forEach(element => {
                        let hookExist = false;
                        databaseUser.organizations.forEach( (org) => {
                            if (org.hooks.length > 0 && element.hooks_url === org.hooks[0]) hookExist = true;
                        })
                        if (!hookExist) {
                            databaseUser["organizations"].push( { name: element.login, commit: true, issue: true, hooks: [element.hooks_url] });
                            createHook("POST", user.data, element.hooks_url).then( (res) => {})
                            .catch( (err) => {
                                console.log(err);
                            })
                        }
                    });

                    postDatabase(databaseUser, "user", "post").then( () => {
                        resolve(user.data);
                    }).catch( (err) => {
                        console.log(err);
                    });
                    
                }).catch( (err) => {
                    console.log(err);
                })
                
            })
            .catch(function (err) {
                reject(err);
            });

        }).catch( (err) => {
            reject(err);
        })
        
    });
}

/**
 * Return the URLs of the webhooks thats not yet set.
 * @param {Object} user 
 * @param {Array} repos 
 */
function findInArray(user, repos) {
    let missingHooks = [];

    user.organizations.find( org => {
        if (org.name === user.username) {
            
            repos.forEach( (repo) =>  {
                let found = false;
                org.hooks.forEach( (hook) =>  {
                    if (repo.hooks_url === hook) {
                        found = true;
                    }
                })
                if (!found) missingHooks.push(repo.hooks_url);
            })
        }
    });
    return missingHooks;
}

/**
 * Post an updated user profile to the internal database api.
 * @param {Object} user 
 * @param {string} url 
 * @param {string} method 
 */
function postDatabase(user, url, method) {
    return new Promise((resolve, reject) => {
        axios({
            method: method,
            url: "http://localhost:3010/"+url,
            data: {
                user: user
            }
        }).then((res) => {
            resolve(res);
        })
        .catch((error) => {
            reject(error);
        })
        
    });
}

/**
 * Post a payload to the internal slack api.
 * @param {Object} user 
 * @param {string} url 
 * @param {string} method 
 */
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
            reject(error);
        })
        
    });
}

/**
 * Options for GitHub api calls (webhooks, organizations and repositories fetches)
 * @param {string} method 
 * @param {Object} user 
 * @param {string} url 
 * @param {Array} events 
 */
function getOptions(method, user, url, events) {
    return {
        method: method,
        uri: url,
        secure: true,
        json: true,
        body: {
            name: "web",
            active: true,
            events: events,
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
}

module.exports = {
    getOrganizations,
    postDatabase,
    postSlack
}
