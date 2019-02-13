"use strict";

const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    githubId: { type: String, required: true },
    username: { type: String, required: true },
    accessToken: { type: String, required: true }
  });

let User = mongoose.model('User', userSchema);

module.exports = User;