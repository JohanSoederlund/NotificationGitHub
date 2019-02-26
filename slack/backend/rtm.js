const { RTMClient } = require('@slack/client');
const axios = require('axios');

// An access token (from your Slack app or custom integration - usually xoxb)
const token = process.env.SLACK_TOKEN;
//const PORT = 3009;

const {CLIENT_ID, CLIENT_SECRET, PORT} = process.env,
      SlackStrategy = require('passport-slack').Strategy,
      passport = require('passport'),
      express = require('express'),
      app = express();

var user = {profile: {}, accessToken: ""};
// setup the strategy using defaults 
//scope: ['identity.basic', 'identity.email', 'identity.avatar', 'identity.team']
passport.use(new SlackStrategy({
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    scope: ['chat:write:user']
  }, (accessToken, refreshToken, profile, done) => {
    // optionally persist profile data
    console.log("accessToken: " + accessToken + " \nrefreshToken: "+ refreshToken + " \nProfile: " + profile);
    user.profile = profile;
    user.accessToken = accessToken;
    
    done(null, profile);
  }
));

app.use(passport.initialize());
app.use(require('body-parser').urlencoded({ extended: true }));

app.get('/', 
  passport.authorize('slack', { failureRedirect: '/auth/slack' }),
  (req, res) => {
        //curl -X POST -H 'Content-type: application/json' --data '{"text":"Allow me to reintroduce myself!"}' YOUR_WEBHOOK_URL
        postSlack('https://slack.com/api/chat.postMessage').then ( (res) => {

        });
        var pr = JSON.stringify(user);
        res.send(pr);

  }
);

// path to start the OAuth flow
app.get('/auth/slack', passport.authorize('slack'));

// OAuth callback url
app.get('/auth/slack/callback', 
  passport.authorize('slack', { failureRedirect: '/auth/slack' }),
  (req, res) => res.redirect('/')
);

app.listen(PORT);

function postSlack(url) {
    return new Promise((resolve, reject) => {
        url = "http://slack.com/api/chat.postMessage?token="+user.accessToken+"&channel="+"U1H386HLL"+"&text="+"hej fran QS";
        
        axios({
            method: 'post',
            url: url
        })
        .then((res) => {
            resolve(res);
        })
        .catch((error) => {
            reject(error);
        })
    });
  }





/*
// The client is initialized and then started to get an active connection to the platform
const rtm = new RTMClient(token);
rtm.start();

// This argument can be a channel ID, a DM ID, a MPDM ID, or a group ID
// See the "Combining with the WebClient" topic below for an example of how to get this ID
const conversationId = 'C1232456';

// The RTM client can send simple string messages
rtm.sendMessage('Hello there', conversationId)
  .then((res) => {
    // `res` contains information about the posted message
    console.log('Message sent: ', res.ts);
  })
  .catch(console.error);
  */