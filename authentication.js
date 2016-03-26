var passport = require('passport');
// Facebook
var facebookConfig = require('./config/facebook');
var FacebookStrategy = require('passport-facebook').Strategy;
// Twitter
var twitterConfig = require('./config/twitter');
var TwitterStrategy = require('passport-twitter').Strategy;

var LocalStrategy = require('passport-local').Strategy;

var models = require('./models');
var User = models.User;

module.exports = passport.use(new FacebookStrategy({
    clientID: facebookConfig.appID,
    clientSecret: facebookConfig.appSecret,
    callbackURL: facebookConfig.callbackUrl
}, function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
        User.findOne({
            where: {
                platform_type: User.PLATFORM_TYPE_FACEBOOK,
                platform_id: profile.id,
            }
        }).then(function(user) {
            if (user) {
                done(null, user);
            } else {
                // Create new user
                User.create({
                    'platform_type': User.PLATFORM_TYPE_FACEBOOK,
                    'platform_id': profile.id,
                    'access_token': accessToken,
                    'refresh_token': refreshToken || '',
                    'role': User.ROLE_AUTHOR,
                    'name': profile.displayName || profile.name,
                }).then(function(newUser) {
                    console.log(newUser);
                    done(null, newUser);
                })
            }
        }).catch(function(err) {
            done(err);
        });
    })
}));

passport.use(new TwitterStrategy({
    consumerKey: twitterConfig.consumerKey,
    consumerSecret: twitterConfig.consumerSecret,
    callbackURL: twitterConfig.callbackUrl
}, function(accessToken, refreshToken, profile, done) {
    User.findOne({
        where: {
            platform_type: User.PLATFORM_TYPE_TWITTER,
            platform_id: profile.id
        }
    }).then(function(user) {
        if (user) {
            done(null, user);
        } else {
            User.create({
                'platform_type': User.PLATFORM_TYPE_TWITTER,
                'platform_id': profile.id,
                'access_token': accessToken,
                'refresh_token': refreshToken || '',
                'role': User.ROLE_AUTHOR,
                'name': profile.displayName,
                'profile_image': profile.photos[0].value,
            }).then(function(newUser) {
                console.log(newUser);
                done(null, newUser);
            })
        }
    }).catch(function(err) {
        done(err);
    });
}));

// Auth by email and password
passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done) {
    User.findOne({
        where: {
            email: email,
            password: User.hashPassword(password),
        }
    }).then(function(user) {
        if (!user) {
            done(null, false, req.flash('message', 'User not found'))
        } else {
            done(null, user);
        }
    }).catch(function(err) {

    })
}));

passport.use('signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
}, function(req, email, password, done) {
    User.findOne({
        where: {
            email: email,
        }
    }).then(function(user) {
        if (user) {
            done(null, false, req.flash('message', 'Email exists!'));
        } else {
            User.create({
                email: email,
                password: User.hashPassword(password),
                name: req.body.name,
            }).then(function(newUser) {
                console.log(newUser);
                done(null, newUser);
            });
        }
    }).catch(function(err) {
        console.error(err);
        done(err,  null);
    })
}));


