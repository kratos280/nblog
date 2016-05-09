//var app = require('./app');
//var io = require('socket.io').listen(app.server);
//io.on('connection', function(socket) {
//    console.log('a user connected');
//    socket.on('msg', function(data) {
//        io.emit('msg', data);
//    });
//});

var twitter = require('ntwitter');
var tw = new twitter({
    consumer_key: 'sdUlmvLFYPL9fBrbuHGQJGwZd',
    consumer_secret: '5NJZmQ5pSlc0VJ7GPxhkLLJmNh2rmBLsif4I8PBLcsT8c7DuW4',
    access_token_key: '2668549782-Dh2JO4pIiavoYiml9lTqTEpIna0UYke3p8wWxdl',
    access_token_secret: 'ijufgcTdnrD4eXpUSsscKmPMpD17Bg7cZkT9xNXlagPfp'
});

tw.stream('statuses/filter', {'track':'football'}, function(stream) {
    stream.on('data', function (data) {
        console.log(data);
    });
});
