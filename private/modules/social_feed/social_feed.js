var express = require('express'),
    path = require('path'),
    request = require('request'),
    feed_settings = require('../../../feed_settings.json'),
    router = express.Router(),
    app = module.exports = express();

function handle_feed(type, response) {
  var options = {
    'url': feed_settings[type]['url'],
    headers: {
      'User-Agent': 'request'
    }
  }
  return request(options, configure_callback(type, response));
}

function configure_callback(type, current_response) {
  return function (error, response, body) {
    if (!error && response.statusCode === 200) {
      // Get multiple feeds here and aggregate them
      current_response.send(clean_feed(type, JSON.parse(body)));
    }
  };
}

function clean_feed(type, body) {
  var cleaned_body = body;

  if (type === 'github') {
    cleaned_body = cleaned_body.filter(function (obj) {
      return obj.type === "PushEvent";
    });

    cleaned_body = cleaned_body.map(function (obj) {
      var messages = [];

      messages = obj.payload.commits;
      messages = messages.map(function (obj) {
        return obj.message;
      });

      return {
        'post-type': type,
        'post-id': obj.id,
        'author': obj.actor.login,
        'avatar_url': obj.actor.avatar_url,
        'messages': messages,
        'datetime': obj.created_at
      };
    });
  }

  return cleaned_body;
}

router.get('/', function (request, response) {
  handle_feed('github', response);
});

app.use('/social', router);

