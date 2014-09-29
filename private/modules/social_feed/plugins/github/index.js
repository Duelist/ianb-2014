var express = require('express'),
    path = require('path'),
    request = require('request'),
    async = require('async'),
    settings = require('./settings.json'),
    router = express.Router(),
    app = module.exports = express();

function clean_feed(body) {
  var cleaned_body = body;

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
      'post-type': __dirname,
      'post-id': obj.id,
      'author': obj.actor.login,
      'picture_url': obj.actor.avatar_url,
      'messages': messages,
      'datetime': obj.created_at
    };
  });

  return cleaned_body;
}

router.get('/feed', function(request, response) {
  options = {
    'url': settings['url'],
    headers: {
      'User-Agent': 'request'
    }
  };

  request.get(settings['url'], function (error, response, body) {
    response.send(clean_feed(JSON.parse(body)));
  })
});

app.use('/github', router);