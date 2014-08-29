var express = require('express'),
    path = require('path'),
    request = require('request'),
    feed_settings = require('../../../feed_settings.json'),
    router = express.Router(),
    app = module.exports = express();

function handle_github_feed() {
  var url = feed_settings.urls.github;
  return request({ url: url });
}

router.get('/', function (request, response) {
  response.send(handle_github_feed());
});

app.use('/social', router);

