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
        findUser({githubId: user.githubId, user: user.username}).then( (existingUser) => {
            console.log("EXISTINGUSER");
            console.log(existingUser);
            if (existingUser.value === null) {
                user.save( (err, saved)=> {
                    if(err) reject({value: err, success: false});
                    resolve({value: saved, success: true});
                })
            } else {
                reject({value: "User allready exist", success: false});
            }
        })
        .catch((error) => {
            reject({value: error, success: false});
        });
    });
}

function updateUser(user) {
    return new Promise((resolve, reject) => {
        if(JSON.stringify(user.schema) !== JSON.stringify(UserModel.schema)) {
            reject({value: "Wrong schema error", success: false});
        }
        //{$set:{name:"Naomi"}}
        UserModel.findOneAndUpdate({username: user.username}, user, {new: true}, (err, updated) => {
            if (err) reject(err);
            resolve(updated);
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


module.exports = {
    connectDatabase,
    disconnectDatabase,
    dropCollection,
    saveNewUser,
    updateUser,
    findUser
}
