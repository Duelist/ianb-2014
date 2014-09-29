var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    request = require('request'),
    async = require('async'),
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
      feed_results = feed_results.concat.apply(results);
      response.send(results);
    }
  });
});

app.use('/social', router);

