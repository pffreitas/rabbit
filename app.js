var express = require('express');
var http = require('http');
var path = require('path');

var index_rawt = require('./routes');
var commits_rawt = require('./routes/commits');
var oauth_rawt = require('./routes/oauth');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', index_rawt.index);
app.get('/:project/commits/list', commits_rawt.listCommits);
app.get('/:project/commits/:sha', commits_rawt.spotCommit);
//app.post('/:project/commits/:sha/comments', commits_rawt.markAsReaded);
app.get('/:project/commits/:sha/comments/markAsReaded', commits_rawt.markAsReaded);

app.get('/oauth', oauth_rawt.requestAuthCode);
app.get('/oauth/receiveAuthToken', oauth_rawt.receiveAuthCode);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});