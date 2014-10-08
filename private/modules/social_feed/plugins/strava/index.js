var express = require('express'),
    path = require('path'),
    request = require('request'),
    async = require('async'),
    moment = require('moment'),
    settings = require('./settings.json'),
    router = express.Router(),
    app = module.exports = express();

function clean_feed(body) {
  var cleaned_body = body;

/*
  cleaned_body = cleaned_body.map(function (obj) {
    return {
      'post-type': 'strava',
      'post-id': obj.id,
      'author': obj.user.screen_name,
      'picture_url': obj.user.username,
      'message': obj.text,
      'datetime': moment(obj.created_at, 'ddd MMM DD HH:mm:ss Z YYYY').format()
    };
  });
*/
  cleaned_body = cleaned_body.map(function (obj) {
    return {
      'post-type': 'strava',
      'post-id': obj.id,
      'name': obj.name,
      'distance': obj.distance,
      'time': obj.elapsed_time
    };
  });

  return cleaned_body;
}

router.get('/feed', function(req, res) {
  var oauth_options, options;

  options = {
    url: settings['url'],
    headers: {
      'User-Agent': 'request',
      'Authorization': 'Bearer ' + settings['access_token']
    }
  };

  console.time('strava');
  request.get(options, function (error, response, body) {
    var json_body;
    console.timeEnd('strava');
    if (!error && response.statusCode === 200) {
      res.send(clean_feed(JSON.parse(body)));
    }
  });
});

app.use('/strava', router);
