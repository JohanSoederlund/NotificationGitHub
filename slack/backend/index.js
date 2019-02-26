const axios = require('axios');


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
