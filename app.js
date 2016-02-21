var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');

var routes = require('./routes/index');
var users = require('./routes/users');
var session = require('express-session');

var MemcachedStore = require('connect-memcached')(session);
var config = require('./config');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(config.cookieHash));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'nblog',
    key: 'nblog',
    proxy: true,
    resave: false,
    saveUninitialized: false,
    store: new MemcachedStore({
        hosts: ['127.0.0.1:11211'],
  })
}));

// Routing
app.get('/', routes.index);
app.get('/login', routes.login);
app.post('/login', routes.login.post);
app.get('/logout', routes.logout);
app.get('/register', routes.register);
app.post('/register', routes.register.post);

app.get('/create', routes.create);
app.post('/create', routes.create.post);
app.get('/:slug', routes.single);
//app.use('/', routes);
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(3000, function() {
    console.log('Example app listen on port 3000!');
});
module.exports = app;
