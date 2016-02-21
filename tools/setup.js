var users = require('../models/users');

// Sset init account
var password = 'root';
var name = 'admin';

users.createUser(name, password, function(err, sid) {
    if (err) {
        console.log('user creation error');
    }
    console.log('user ' + name + 'created.sid:' +sid);
});