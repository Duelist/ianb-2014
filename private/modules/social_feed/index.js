var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    request = require('request'),
    async = require('async'),
    jade = require('jade'),
    router = express.Router(),
    app = module.exports = express();

function handle_feed(endpoint, callback) {
  return request.get('http://127.0.0.1:3000' + endpoint, function (error, response, body) {
    callback(error, body);
  });
}

router.get('/', function (request, response) {
  var feed_list = [],
      module_dir = path.join(__dirname, 'plugins');

  feed_list = fs.readdirSync(module_dir).filter(function (file) {
    var stats = fs.lstatSync(path.join(module_dir, '/', file));
    return stats.isDirectory();
  }).map(function (dir) {
    return path.join('/', dir, '/feed');
  });

  async.map(feed_list, handle_feed, function (error, results) {
    var feed_results = [];
    if (!error) {
      results = results.map(JSON.parse);
      feed_results = results.reduce(function (a, b) {
        return a.concat(b);
      });

      // TODO: Sort feed by datetime

      // TODO: Render templates per feed
      feed_results = feed_results.map(function (object) {
        var template_path = path.join(module_dir, '/', object['post-type'], '/templates/card.jade');
        return jade.renderFile(template_path, object);
      });

      response.send(feed_results);
    }
  });
});

app.use('/social', router);

