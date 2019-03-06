"use strict";

const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    githubId: { type: String, required: true },
    username: { type: String, required: true },
    githubAccessToken: { type: String, required: true },
    slackId: { type: String},
    slackAccessToken: { type: String},
    organizations: { type: Object },
    notifications: { type: Object },
    settings: {  }
  });

let User = mongoose.model('User', userSchema);

module.exports = User;