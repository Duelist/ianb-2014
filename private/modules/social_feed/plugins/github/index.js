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

  cleaned_body = cleaned_body.filter(function (obj) {
    return obj.type === "PushEvent";
  }).map(function (obj) {
    var commits = obj.payload.commits.map(function (commit) {
      commit.sha_short = commit.sha.slice(0, 7);
      return commit;
    });
    return {
      'post-type': 'github',
      'post-id': obj.id,
      'author': obj.actor.login,
      'picture_url': obj.actor.avatar_url,
      'messages': obj.payload.commits,
      'datetime': moment(obj.created_at, moment.ISO_8601).format()
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

  console.time('github');
  request.get(options, function (error, response, body) {
    res.send(clean_feed(JSON.parse(body)));
    console.timeEnd('github');
  });
});

app.use('/github', router);
