var express = require('express'),
    path = require('path'),
    request = require('request'),
    async = require('async'),
    feed_settings = require('../../../feed_settings.json'),
    router = express.Router(),
    app = module.exports = express();

function handle_feeds(response) {
  var feed_list = Object.keys(feed_settings);
  async.map(feed_list, handle_feed, function (error, results) {
    var feed_results = [];
    if (!error) {
      feed_results = feed_results.concat.apply(feed_results, results);
      response.send(feed_results);
    }
  });
}

function handle_feed(type, callback) {
  var options = {
    'url': feed_settings[type]['url'],
    headers: {
      'User-Agent': 'request'
    }
  }
  return request(options, configure_request_callback(type, callback));
}

function configure_request_callback(type, callback) {
  return function (error, response, body) {
    if (!error && response.statusCode === 200) {
      return callback(null, clean_feed(type, JSON.parse(body)));
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
        'picture_url': obj.actor.avatar_url,
        'messages': messages,
        'datetime': obj.created_at
      };
    });
  } else if (type === 'lastfm') {
    var author = cleaned_body['recenttracks']['@attr']['user'];

    cleaned_body = cleaned_body['recenttracks']['track'];

    cleaned_body = cleaned_body.map(function (obj, index) {
      var picture_url,
          messages = [];
      messages.push(obj['artist']['#text'] + ' - ' + obj.name);

      picture_url = obj.image.filter(function (image) {
        return image.size === "extralarge";
      });

      picture_url = picture_url[0]['#text'];

      return {
        'post-type': type,
        'post-id': index,
        'author': author,
        'picture_url': picture_url,
        'messages': messages,
        'datetime': obj.date.uts
      };
    });
  } else if (type === 'twitter') {
    
  }

  return cleaned_body;
}

router.get('/', function (request, response) {
  handle_feeds(response);
});

app.use('/social', router);

