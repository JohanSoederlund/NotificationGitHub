"use strict";

// Imports
const mongoose =require('mongoose');
const UserModel = require('../database/userModel');

const connectionString = 'mongodb://localhost:27017';
   
function connectDatabase() {
    //mongoose.connect(connectionString, { useNewUrlParser: true })
    mongoose.connect(connectionString)
    .then( ()=> {
        console.log("CONNECTED to " + connectionString);
    })
    .catch((err) => {
        console.log('connection-error', err);
    });
}
    
/**
 * Disconnects from the database if there is an active connection.
 */
function disconnectDatabase() {
    mongoose.connection.close( (err)=> {
        if (err) console.error(err);
        else console.log("DISCONNECTED from " + connectionString);
    })
}

function dropCollection(collection) {
    return new Promise((resolve, reject) => {
        mongoose.connection.db.dropCollection( collection )
        .then( (response) => {
            resolve(response);
        })
        .catch((error) => {
            reject("Could not drop collection: \n" + error, false);
        });
    });
}

function saveNewUser(user) {
    return new Promise((resolve, reject) => {
        if (user.organizations === undefined) {
            user.organizations = [];
        }
        if (user.notifications === undefined) {
            user.notifications = [];
        }
        user = new UserModel(user);
        findUser({username: user.username}).then( (existingUser) => {
            if (existingUser.value === null) {
                user.save( (err, saved)=> {
                    if(err) reject({value: err, success: false});
                    resolve({value: saved, success: true});
                })
            } else {
                updateUser(user, existingUser).then ( (res)=> {
                    resolve({value: res.value, success: false});
                });
            }
        })
        .catch((error) => {
            reject({value: error, success: false});
        });
    });
}

function updateUser(user, existingUser) {
    return new Promise((resolve, reject) => {
        
        let option = {
            new: true,
            useFindAndModify: false
        }
        let usr = {githubId: user.githubId, username: user.username, githubAccessToken: user.githubAccessToken, slackId: "", slackAccessToken: ""};
        if ('slackId' in user) usr.slackId = user.slackId;
        if ('slackAccessToken' in user) usr.slackAccessToken = user.slackAccessToken;
        if (user.hasOwnProperty('settings')) usr.settings = user.settings;
        if ('notifications' in user && user.notifications !== undefined) usr.notifications = user.notifications;
        if ('organizations' in user && user.organizations !== undefined) usr.organizations = user.organizations;
        else usr.organizations = existingUser.organizations;
       
        UserModel.findOneAndUpdate({username: user.username}, usr, option, (err, updated) => {
            if (err) reject(err);
            resolve({value: updated, success: true});
        });
    });
}

function findUser(user) {
    return new Promise((resolve, reject) => {
        UserModel.findOne(user)
        .then((user) => {
            resolve({value: user, success: true});
        })
        .catch((error) => {
            reject({value: "Invalid user credentials", success: false});
        });
    });
}

function findUsers() {
    return new Promise((resolve, reject) => {
        UserModel.find({})
        .then((users) => {
            resolve({value: users, success: true});
        })
        .catch((error) => {
            reject({value: "Invalid user credentials", success: false});
        });
    });
}

function deleteNotifications(user) {
    return new Promise((resolve, reject) => {
        UserModel.findOne({username: user.username})
        .then((user) => {
            user.notifications = [];
            updateUser(user)
            .then((user) => {
                //console.log(user);
                resolve({value: user, success: true});
            })
            .catch((error) => {
                reject({value: "Invalid user credentials", success: false});
            });
        })
        .catch((error) => {
            reject({value: "Invalid user credentials", success: false});
        });
    });
}

module.exports = {
    connectDatabase,
    disconnectDatabase,
    dropCollection,
    saveNewUser,
    updateUser,
    findUser,
    findUsers,
    deleteNotifications
}
