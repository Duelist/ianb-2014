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

app.use('/', router);

app.listen(3000)

