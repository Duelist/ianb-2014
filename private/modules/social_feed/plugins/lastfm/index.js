var express = require('express'),
    path = require('path'),
    request = require('request'),
    async = require('async'),
    settings = require('./settings.json'),
    router = express.Router(),
    app = module.exports = express();

function clean_feed(body) {
  var cleaned_body = body,
      author = cleaned_body['recenttracks']['@attr']['user'];

  cleaned_body = cleaned_body['recenttracks']['track'];

  cleaned_body = cleaned_body.map(function (obj, index) {
    var now_playing = false,
        date_time,
        picture_url;

    picture_url = obj.image.filter(function (image) {
      return image.size === "extralarge";
    });

    picture_url = picture_url[0]['#text'];

    if (obj['@attr']) {
      now_playing = obj['@attr']['nowplaying'];
    }

    if (now_playing) {
      date_time = '';
    } else {
      date_time = obj.date.uts;
    }

    return {
      'post-type': 'lastfm',
      'post-id': index,
      'author': author,
      'picture_url': picture_url,
      'message': obj['artist']['#text'] + ' - ' + obj.name,
      'now_playing': now_playing,
      'datetime': date_time
    };
  });

  return cleaned_body;
}

router.get('/feed', function(req, res) {
  var options = {
    'url': settings['url'],
    headers: {
      'User-Agent': 'request'
    }
  };

  request.get(options, function (error, response, body) {
    res.send(clean_feed(JSON.parse(body)));
  });
});

app.use('/lastfm', router);
