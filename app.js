var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');

var users = require('./routes/users');
var session = require('express-session');

var MemcachedStore = require('connect-memcached')(session);
var config = require('./config');
var flash = require('connect-flash');

// TODO call as singleton
var models = require('./models');
// Sync sequelize models
models.sequelize.sync().then(function(err) {
    if (err) {
        throw err[0];
    } else {
        // DB seed
        // Listen app
    }
});

var app = express();
var expressValidator = require('express-validator');
var methodOverride = require('method-override');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator([]));
app.use(cookieParser(config.cookieHash));
app.use(methodOverride(function(req, res){
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
    }
}));
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
app.use(flash());

// Passport
var passport = require('passport');
var auth = require('./authentication');
app.use(passport.initialize());
app.use(passport.session());

// serialize and deserialize to create or delete user passport session
passport.serializeUser(function(user, done) {
    console.log('serializeUser: ' + user.user_id);
    done(null, user.user_id);
});
passport.deserializeUser(function(id, done) {
    models.User.findById(id).then(function(user) {
        done(null, user);
    });
});

// Routing
var routes = require('./routes/index');
app.get('/', routes.index);
app.get('/signup', routes.signup);
app.post('/signup', passport.authenticate('signup', {
    failureRedirect: '/signup',
}), function(req, res) {
    console.log('Signup success');
    res.redirect('/');
});
// Social auth
app.get('/login/facebook', passport.authenticate('facebook', function(req, res) {}));
app.get('/login/facebook/callback', passport.authenticate('facebook', {failureRedirect: '/login'}),
    function(req, res) {
        console.log('Facebook login success');
        res.redirect('/');
    });
app.get('/login/twitter', passport.authenticate('twitter', function(req, res) {}));
app.get('/login/twitter/callback', passport.authenticate('twitter', {failureRedirect: '/login'}),
    function(req, res) {
        console.log('Twitter login success');
        res.redirect('/');
    });
app.get('/login', routes.login);
app.post('/login', passport.authenticate('login', {
    failureRedirect: '/login',
}), function(req, res) {
    console.log('Login success');
    res.redirect('/');
});

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
});

var postRoutes = require('./routes/posts');
app.use('/posts', postRoutes);

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

var server = app.listen(3000, function() {
    console.log('Example app listen on port 3000!');
});

// Socket
var io = require('socket.io').listen(server);
io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('msg', function(data) {
        io.emit('msg', data);
    });
});

// passport authentication (as a middleware)
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/register');
}

module.exports = app;
