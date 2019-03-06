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
        if(JSON.stringify(user.schema) !== JSON.stringify(UserModel.schema)) {
            reject({value: "Wrong schema error", success: false});
        } 
        findUser({username: user.username}).then( (existingUser) => {
            console.log("EXISTINGUSER");
            console.log(existingUser);
            if (existingUser.value === null) {
                user.save( (err, saved)=> {
                    if(err) reject({value: err, success: false});
                    resolve({value: saved, success: true});
                })
            } else {
                updateUser(user, existingUser).then ( (res)=> {
                    resolve({value: res.value, success: true});
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
        /*
        try {
            new UserModel(user);
        } catch (error) {
            reject({value: "Wrong schema error", success: false});
        }
        */
        let option = {
            new: true,
            useFindAndModify: false
        }
        let usr = {githubId: user.githubId, username: user.username, githubAccessToken: user.githubAccessToken, slackId: "", slackAccessToken: "", notifications: []};
        if ('slackId' in user) usr.slackId = user.slackId;
        if ('slackAccessToken' in user) usr.slackAccessToken = user.slackAccessToken;
        if ('organizations' in user) usr.organizations = user.organizations;
        
        if ('notifications' in existingUser) usr.notifications = existingUser.notifications;
        if ('notifications' in user) {
            user.notifications.forEach(element => {
                usr.notifications.push(element);
            });
        }
        
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
            console.log("user");
            console.log(user);
            resolve({value: user, success: true});
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
    findUser
}
