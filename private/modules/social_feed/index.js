var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    request = require('request'),
    async = require('async'),
    router = express.Router(),
    app = module.exports = express();

function handle_feeds(response) {
  var feed_list = [];

  feed_list = fs.readdirSync(module_dir).map(function (file) {
    return path.join(module_dir, '/', file);
  });

  async.map(feed_list, handle_feed, function (error, results) {
    var feed_results = [];
    if (!error) {
      feed_results = feed_results.concat.apply(results);
      response.send(results);
    }
  });
}

function handle_feed(path, callback) {
  return request.get(path, function (error, response, body) {
    callback(error, body);
  });
}

function handle_feed_old(type, callback) {
  var oauth_options, options, api_key_and_secret, api_token;
  if (type === 'twitter') {
    api_key_and_secret = [feed_settings[type]['api_key'], feed_settings[type]['api_secret']].join(':');
    api_token = new Buffer(api_key_and_secret).toString('base64');

    oauth_options = {
      url: feed_settings[type]['oauth_url'],
      headers: {
        'User-Agent': 'request',
        'Authorization': 'Basic ' + api_token,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: 'grant_type=client_credentials' 
    }

    request.post(oauth_options, function (error, response, body) {
      var json_body;
      if (!error && response.statusCode == 200) {
        json_body = JSON.parse(body);
        options = {
          'url': feed_settings[type]['url'],
          headers: {
            'User-Agent': 'request',
            'Authorization': 'Bearer ' + json_body['access_token']
          }
        };

        return request(options, configure_request_callback(type, callback));
      }
    });
  }
}

function clean_feed(type, body) {
  var cleaned_body = body;

  if (type === 'lastfm') {
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
    cleaned_body = cleaned_body.map(function (obj) {
      var messages = [];

      messages.push(obj.text);

      return {
        'post-type': type,
        'post-id': obj.id,
        'author': obj.user.screen_name,
        'picture_url': obj.user.username,
        'messages': messages,
        'datetime': obj.created_at
      };
    });
  }

  return cleaned_body;
}

router.get('/', function (request, response) {
  handle_feeds(response);
});

app.use('/social', router);

