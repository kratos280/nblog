var express = require('express');
var models = require('../models');
var Post = models['Post'];
var User = models['User'];
var router = express.Router();

router.route('/')
    // Get All posts
    .get(function(req, res, next) {
        Post.all({
            offset: 0,
            limit: 1,
            order: [
                ['post_id', 'DESC'],
            ]
        }).then(function(posts) {
            res.render('posts/index', {
                title: 'All post',
                message: req.message,
                user: req.user,
                posts: posts,
            })
        }).catch(function(e) {
            console.error(e);
        });
    })
    // Create a new post
    .post(function(req, res, next) {
        if (!req.isAuthenticated()) {
            res.redirect('/login');
        }

        var validationSchema = {
            'title': {
                notEmpty: {
                    errorMessage: 'Title can not empty'
                },
            },
            'slug': {
                notEmpty: {
                    errorMessage: 'Slug can not empty',
                }
            },
            'body': {
                notEmpty: {
                    errorMessage: 'Body can not empty'
                }
            }
        };
        req.checkBody(validationSchema);
        var errors = req.validationErrors();
        if (errors) {
            req.flash('errors', errors);
            res.redirect('/posts/new');
            return;
        }

        var input = req.body;
        Post.create({
            title: input.title,
            slug: input.slug,
            body: input.body,
            user_id: req.user.user_id
        }).then(function(newPost) {
            req.flash('message', 'Post is created');
            res.redirect('/posts');
        }).catch(function(err) {
            console.error(err);
            req.flash('message', 'Error orcured');
            res.redirect('/posts/new');
        });
    });
router.get('/new', function(req, res) {
    res.render('posts/new', {
        title: 'Create new post',
        errors: req.flash('errors'),
        user: req.user,
    });
});
router.route('/:id')
    .get(function(req, res) {
        Post.findById(req.params.id, {
            include: [User],
        }).then(function(post) {
            if (!post) {
                res.sendStatus(404);
                return;
            }
            res.render('posts/item', {
                title: 'Post Detail',
                post: post,
                user: req.user,
            });
        }).catch(function(e) {
            console.error(e);
            res.sendStatus(404);
            return;
        })
    })
    .delete(function(req, res) {
        if (!req.isAuthenticated()) {
            res.redirect('/login');
        }

        Post.findById(req.params.id).then(function(post) {
            if (!post) {
                res.sendStatus(404);
                return;
            }
            if (post.user_id != req.user.user_id) {
                res.sendStatus(403);
                return;
            }
            post.destroy().then(function() {
                console.log('Deleted post, id: ' + req.params.id );
                res.redirect('/posts');
            });
        }).catch(function(e) {
            console.error('Error orccur ' + e);
        })
    })
    .put(function(req, res) {
       if (!req.isAuthenticated()) {
           res.redirect('/login');
           return;
       }

        Post.findById(req.params.id).then(function(post) {
            if (!post) {
                res.sendStatus(404);
                return;
            }
            if (post.user_id != req.user.user_id) {
                res.sendStatus(403);
                return;
            }

            var validationSchema = {
                'title': {
                    notEmpty: {
                        errorMessage: 'Title can not empty'
                    },
                },
                'slug': {
                    notEmpty: {
                        errorMessage: 'Slug can not empty',
                    }
                },
                'body': {
                    notEmpty: {
                        errorMessage: 'Body can not empty'
                    }
                }
            };
            req.checkBody(validationSchema);
            var errors = req.validationErrors();
            if (errors) {
                req.flash('errors', errors);
                req.flash('oldInput', req.body);
                res.redirect('/posts/' + post.post_id + '/edit');
                return;
            }

            var input = req.body;
            post.update({
                title: input.title,
                slug: input.slug,
                body: input.body,
            }).then(function(post) {
                res.redirect('/posts/' + post.post_id);
            })
        }).catch(function(e) {
            console.error('Error orccur ' + e);
        })
    });
router.get('/:id/edit', function(req, res) {
    if (!req.isAuthenticated()) {
        res.redirect('/login');
    }
    Post.findById(req.params.id).then(function(post) {
        if (!post) {
            res.sendStatus(400);
            return;
        }
        if (post.user_id != req.user.user_id) {
            res.sendStatus(403);
            return;
        }
        res.render('posts/edit', {
            post: post,
            user: req.user,
            errors: req.flash('errors'),
            oldInput: req.flash('oldInput'),
        });
    })
});

module.exports = router;
