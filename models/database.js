var mysql = require('mysql');
var config = require('../config');

// Model Base: base class
var Database = function () {};

// Auth
Database.prototype.dbAuth = config.databaseAuth;

// Create Mysql Client Object
Database.prototype._getClient = function () {
    if (this.client === undefined) {
        this.client = mysql.createConnection(this.dbAuth);
    }
    return this.client;
};

// Implement query
Database.prototype.query = function (query, params, callback) {
    var client = this._getClient();
    return client.query(query, params, callback);
};

// End query
Database.prototype.end = function (callback) {
    if (this.client) {
        this.client.end(callback);
        delete this.client;
    }
};

// Create Database client
function createClient() {
    return new Database();
}

exports.createClient = createClient;