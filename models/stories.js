var database = require('./database');
var db = database.createClient();
var stories = exports;
stories.insert = function (story, callback) {
    var params = [
        story.slug,
        story.title,
        story.body,
    ];
    db.query(
        'INSERT INTO stories'  + '(sid, slug, title, body, cdate) ' + 'VALUES ' +
        '(NULL, ?, ?, ?, NOW())' + ';',
    params,
    function (err, results, fields) {
        db.end();
        var sid = results.insertId;
        if (err) {
        callback(new Error('Insert failed'));
        return;
        }
        return callback(null);
    }
    );
};

stories.getBySid = function (sid, callback) {
    db.query(
        'SELECT *FROM stories WHERE sid = ?',
        [sid], function (err, results, fields) {
            db.end();
            if (err) {
                callback(err);
                return;
            }
            if (results && (results.length > 0)) {
                var story = new Story(results[0]);
                callback(null, story);
                return;
            }
            callback(null, null);
        });
};

stories.getBySlug = function (slug, callback) {
    db.query(
        'SELECT * FROM stories WHERE slug = ?',
        [slug],
        function (err, results, fields) {
            if (err) {
                callback(err);
                return;
            }
            if (results && (results.length > 0)) {
                callback(null, results[0]);
            }
            callback(null, null);
        }
        );
};

stories.getLatest = function (count, skip, callback) {
    // skip引数はオプションなので省略可能
    if ('function' === typeof skip) {
        callback = skip;
        skip = undefined;
    }
    skip = skip | 0;
    db.query(
        'SELECT * FROM stories ORDER BY cdate DESC LIMIT ?, ?', [skip, count],
        function (err, results, fields) {
            db.end();
            if (err) {
                callback(err);
                return;
            }
            callback(null, results);
        });
 };

stories.createStory = function (values, callback) {
    var datetime = new Date();
    db.query(
        'INSERT INTO stories' + '(sid, title, slug, body, cdate)' + 'VALUES' + '(NULL, ?, ?, ?, ?)' +';',
        [values.title, values.slug, values.body, datetime],
        function (err, results, fields) {
            db.end();
            if (err) {
                callback(new Error('Insert failed'), null);
            }
            var storyInfo = {
                title: results.title,
                slug: results.slug,
                body: results.body,
            };
            callback(null, storyInfo);
        }
    );
};



