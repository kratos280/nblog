var crypto = require('crypto');
var database = require('./database');
var db = database.createClient();
var users = exports;

// Auth
users.authenticate = function (name, password, callback) {
    var hashedPassword = _hashPassword(password);
    db.query('SELECT * FROM users WHERE name = ? AND password = ?', [name, hashedPassword],
    function queryCallback(err, results, fields) {
        db.end();
        if (err) {
            callback(err);
            return;
        }
        if (results && (results.length > 0)) {
            userInfo = results[0];
            if (userInfo.password == _hashPassword(password)) {
                delete userInfo.password;
                callback(null, userInfo);
                return;
            }
        }

        // Error
        callback(err, null);
        return;
    });
};

function _hashPassword(password) {
    if (password === '') {
        return '';
    }
    var shasum = crypto.createHash('sha256');
    shasum.update(password);
    return shasum.digest('hex');
}

users.createUser = function (name, password, callback) {
    var hashedPassword = _hashPassword(password);
    db.query(
        'INSERT INTO users' + '(uid, name, password)' + 'VALUES' + '(NULL, ?, ?)' + ';',
        [name, hashedPassword],
        function(err, results, fields) {
            db.end();
            var userInfo = {
                uid: results.insertId,
                name: name
            };
            if (err) {
                callback(new Error('INSERT failed'), null);
            }
            callback(null, userInfo);
        });
};