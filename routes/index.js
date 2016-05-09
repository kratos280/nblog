var express = require('express');
var router = express.Router();
var models = require('../models');
var passport = require('passport');

exports.login = function(req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/');
    }
    res.render('login', {
        title: 'Login',
        message: req.flash('message'),
    });

    return;
};

exports.login.post = function(req, res) {

};

exports.signup = function (req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/');
    }
    res.render('signup', {
        title: 'Signup',
        message: req.flash('message'),
    });

    return;
};

exports.signup.post = function(req, res) {
    var email = req.body.email || '';
    var password = req.body.password || '';

    models.User.create({
        'email': email,
        'password': password
    }).then(function(user) {
        if (user === undefined) {
            console.error('Create user failed');
            res.send(500);
        }
        res.session.user = {
            user_id: user.user_id,
        };
        console.log(user);
        res.redirect('/');
    });
};

exports.logout = function(req, res) {
    req.session.destroy(function(err) {
        res.redirect('/');
    });
};

exports.index = function(req, res) {
    res.render('index', {});
};

exports.single = function(req, res) {
    var slug = req.params.slug || '';
    function callback(err, story) {
        if (err || story == null) {
            // 400 err page
            return;
        }
        res.render('single', {
            title: story.slug,
            story: story,
        });
    };

    // stories.getBySlug(slug, callback);
};

exports.create = function(req, res) {
    res.render('create_story', {
        title: 'Create  new story',
    });
}

exports.create.post = function(req, res) {
    var title = req.body.title || '';
    var slug = req.body.slug || '';
    var body = req.body.body || '';

    var story = {
        title: title,
        slug: slug,
        body: body,
    };

    function callback(err, storyInfo) {
        if (err || storyInfo == null) {
            res.render('create_story', {
                title: 'Create new story',
                error: 500,
                message: 'Could not create new story'
            });
            return
        }

        res.redirect('/');
    }

    stories.createStory(story, callback);
}
//module.exports = router;
