"use strict";

const mongoose = require('mongoose');

let notificationHubUserSchema = new mongoose.Schema({
    githubId: { type: String, required: true },
    username: { type: String, required: true },
    githubAccessToken: { type: String, required: true },
    slackId: { type: String},
    slackAccessToken: { type: String},
    organizations: { type: Object },
    notifications: { type: Object }
  });

let NotificationHubUser = mongoose.model('NotificationHubUser', notificationHubUserSchema);

module.exports = NotificationHubUser;