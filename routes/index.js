var express = require('express');
var router = express.Router();

var users = require('../models/users');
var stories = require('../models/stories');

// TODO validate input

exports.login = function(req, res) {
    res.render('login', {
        title: 'Login',
        user: null,
        name: '',
        error: 200,
        loginFailed: false,
    });

    return;
};

exports.login.post = function(req, res) {
    var name = req.body.name || '';
    var password = req.body.password || '';

    function authCallback(err, userInfo) {
        if (err || userInfo === null) {
            res.render('login', {
                title: 'Login',
                user: null,
                name: name,
                error: 200,
                loginFailed: true
            });
            return;
        }
        // Login success
        req.session.user = {
            uid: userInfo.uid,
            name: userInfo.name,
        };
        res.redirect('/');
        return;
    }

    users.authenticate(name, password, authCallback);
};

exports.register = function (req, res) {
    res.render('register', {
        title: 'Register',
        registerFailed: false
    });

    return;
};

exports.register.post = function(req, res) {
    var name = req.body.name || '';
    var password = req.body.password || '';

    function registerCallback(err, userInfo) {
        if (err || userInfo == null) {
            res.render('register', {
                title: 'Register',
                registerFailed: true,
                name: name,
                error: 200
            });
            return;
        }
        // Register success
        req.session.user = {
            uid: userInfo.uid,
            name: userInfo.name
        };

        res.redirect('/');
        return;
    }

    users.createUser(name, password, registerCallback);
};

exports.logout = function(req, res) {
    req.session.destroy(function(err) {
        res.redirect('/');
    });
};

exports.index = function(req, res) {
    var length = require('../config/parameters').storyCountPerPage;
    var pageNum = Number(req.query.page) || 1;
    var skip = length * (pageNum - 1);

    stories.getLatest(length + 1, skip, function(err, items) {
        if (err) {
            res.send(500);
            console.log('Can not retrive stores');
            console.log(err);
            return;
        }

        // Create next and previous page Link
        var nextPage = null;
        if (items.length > length) {
            nextPage = '/?page=' + (pageNum +1);
            items.pop();
        }
        var previousPage = null;
        if (skip > 0 ) {
            if (pageNum == 2) {
                previousPage = '/';
            } else {
                previousPage = '/?page=' + (pageNum -1);
            }
        }

        // Render Template
        var params = {
            title: 'Stories',
            page: {
                next: nextPage,
                previous: previousPage
            },
            user: req.session.user || null,
            stories: items,
            request: req,
        };
        res.render('index', params);
    });
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

    stories.getBySlug(slug, callback);
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
