var express = require('express'),
    path = require('path'),
    request = require('request'),
    feed_settings = require('../../../feed_settings.json'),
    router = express.Router(),
    app = module.exports = express();

var current_response;

function handle_github_feed() {
  var options = {
    'url': feed_settings.urls.github,
    headers: {
      'User-Agent': 'request'
    }
  }
  return request(options, github_request_callback);
}

function github_request_callback(error, response, body) {
  if (!error && response.statusCode === 200) {
    current_response.send(clean_github_feed(JSON.parse(body)));
  }
}

function clean_github_feed(body) {
  var cleaned_body = body;

  cleaned_body = cleaned_body.filter(function (obj) {
    return obj.type === "PushEvent";
  });

  cleaned_body = cleaned_body.map(function (obj) {
    var messages = [];

    messages = obj.payload.commits;
    messages.map(function () {
      return obj.message;
    });

    return {
      'id': obj.id,
      'username': obj.actor.login,
      'avatar_url': obj.actor.avatar_url,
      'messages': messages,
      'datetime': obj.created_at
    };
  });
  return cleaned_body;
}

router.get('/', function (request, response) {
  current_response = response;
  handle_github_feed();
});

app.use('/social', router);

