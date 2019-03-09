"use strict";
const rp = require('request-promise');
const axios = require('axios');

const SECRET = process.env.SECRET;
const URL = process.env.URL;


function createHook(method, user, url) {

    var options = getOptions(method, user, url, ["issues", "push"]);
    
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

/**
 * Don't send hooks if already exists
 */
function getOrganizations(username) {
    console.log("GETORGANIZATIONS");
    return new Promise((resolve, reject) => {
        postDatabase({ username: username }, "user", "get").then( (user) => {
            var options = getOptions("GET", user.data, "https://api.github.com/user/orgs");
            
            console.log(user.data);

            rp(options)
            .then(function (orgResponse) {
                
                var databaseUser = user.data;
                //Users public repos will always have index 0 in organizations array
                if (databaseUser.organizations.length === 0) databaseUser["organizations"] = [ { name: user.data.username, commit: true, issue: true, hooks: [] }];

                console.log(databaseUser);
                
                createHook("GET", user.data, "https://api.github.com/users/"+user.data.username+"/repos").then( (publicRepoResponse) => {
                    
                    let missingHooksUrls = findInArray(databaseUser, publicRepoResponse);
                    missingHooksUrls.forEach( (element) => {
                        databaseUser.organizations[0].hooks.push(element);
                    })
                    
                    
                    missingHooksUrls.forEach(element => {
                        
                        createHook("POST", user.data, element).then( (res) => {
                            console.log("CREATE PUBLIC HOOK RESPONSE");

                            
                        }).catch( (err) => {
                            console.log("ERROR PUBLIC POST HOOK");
                        })
                    })
                    
                   console.log("\n\nDATABASEUSER");
                   console.log(databaseUser);
                   console.log("\n\n");
                    
                    orgResponse.forEach(element => {
                        let hookExist = false;
                        databaseUser.organizations.forEach( (org) => {
                            console.log(org);
                            if (org.hooks.length > 0 && element.hooks_url === org.hooks[0]) {
                                hookExist = true;
                            }
                        })
                        if (!hookExist) {
                            databaseUser["organizations"].push( { name: element.login, commit: true, issue: true, hooks: [element.hooks_url] });
                            createHook("POST", user.data, element.hooks_url).then( (res) => {
                                console.log("CREATE HOOK RESPONSE");
                            }).catch( (err) => {
                                console.log("ERROR ORG POST HOOK");
                            })
                        }
                        
                        /*
                        createHook("GET", user.data, element.hooks_url).then( (res) => {
                            console.log("Hook for " + element.hooks_url + " already exist.");
                        }).catch( (err) => {
                            console.log("ERROR POST HOOK");
                            
                            createHook("POST", user.data, element.hooks_url).then( (res) => {
                                console.log("CREATE HOOK RESPONSE");
                            }).catch( (err) => {
                                console.log("ERROR POST HOOK");
                            })
                            
                        })
                        */
                    });
                    

                    postDatabase(databaseUser, "user", "post").then( () => {
                        console.log("POST to database success in RP");
                        resolve(user.data);
                    }).catch( (err) => {
                        console.log("POST to database ERROR in RP");
                    });
                    
                }).catch( (err) => {
                    console.log("ERROR get public repos");
                    console.log(err);
                })

                
            })
            .catch(function (err) {
                console.log("rp error1: " + err);
                reject(err);
            });

        }).catch( (err) => {
            console.log(err);
        })
        
    });
}

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

function getOptions(method, user, url, events) {

    console.log("\n\n\n");
    console.log(user.data);
    //IF ERROR CHECK CONFIG url and events
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
