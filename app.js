var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    social_feed = require('./private/modules/social_feed/'),
    router = express.Router(),
    app = express();

app.set('views', path.join(__dirname, 'private/templates'));
app.set('view engine', 'jade');
app.use('/static', express.static(path.join(__dirname, '/public')));

var module_dir = path.join(__dirname, 'private/modules/social_feed/plugins');
fs.readdirSync(module_dir).map(function (file) {
  var module_path = path.join(module_dir, '/', file);
  fs.stat(module_path, function (err, stats) {
    if (stats.isDirectory()) {
      app.use(require(module_path));
    }
  });  
});

router.get('/', function (request, response) {
  response.render('index');
});

router.get('/about', function (request, response) {
  response.render('about');
});

router.get('/resume', function (request, response) {
  response.render('resume');
});

app.use('/', router);
app.use(social_feed);

app.listen(3000)

