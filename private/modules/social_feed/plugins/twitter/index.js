var express = require('express'),
    path = require('path'),
    request = require('request'),
    async = require('async'),
    settings = require('./settings.json'),
    router = express.Router(),
    app = module.exports = express();

function clean_feed(body) {
  var cleaned_body = body;

  cleaned_body = cleaned_body.map(function (obj) {
    return {
      'post-type': 'twitter',
      'post-id': obj.id,
      'author': obj.user.screen_name,
      'picture_url': obj.user.username,
      'message': obj.text,
      'datetime': obj.created_at
    };
  });

  return cleaned_body;
}

router.get('/feed', function(req, res) {
  var oauth_options, options, api_key_and_secret, api_token;

  api_key_and_secret = [settings['api_key'], settings['api_secret']].join(':');
  api_token = new Buffer(api_key_and_secret).toString('base64');

  oauth_options = {
    url: settings['oauth_url'],
    headers: {
      'User-Agent': 'request',
      'Authorization': 'Basic ' + api_token,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: 'grant_type=client_credentials' 
  }

  request.post(oauth_options, function (error, response, body) {
    var json_body;
    if (!error && response.statusCode === 200) {
      json_body = JSON.parse(body);
      options = {
        'url': settings['url'],
        headers: {
          'User-Agent': 'request',
          'Authorization': 'Bearer ' + json_body['access_token']
        }
      };

      return request.get(options, function (error, response, body) {
        res.send(clean_feed(JSON.parse(body)));
      });
    }
  });
});

app.use('/twitter', router);
