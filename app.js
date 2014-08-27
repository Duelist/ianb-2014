var express = require('express'),
    path = require('path'),
    router = express.Router(),
    app = express();

app.set('views', path.join(__dirname, 'private/templates'));
app.set('view engine', 'jade');
app.use('/static', express.static(path.join(__dirname, '/public')));

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

app.listen(3000)

