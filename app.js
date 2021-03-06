var express = require('express');
var http = require('http');
var path = require('path');

var index_rawt = require('./routes');
var commits_rawt = require('./routes/commits');
var oauth_rawt = require('./routes/oauth');
var project_insight_rawt = require('./routes/ProjectInsightRouter.js');

var app = express();
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('XPTO'));
app.use(express.session({
    secret: 'XPTO'
}));
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));


if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', index_rawt.index);
app.get('/:project/commits/list', commits_rawt.listCommits);
app.get('/:project/commits/:sha', commits_rawt.spotCommit);
app.get('/:project/commits/:sha/comments/markAsReaded', commits_rawt.markAsReaded);

app.get('/insight/projects', project_insight_rawt.getInsightProjects);
app.get('/:project/insight/:insight', project_insight_rawt.getProjectInsight);
app.put('/:project/insight', project_insight_rawt.receiveProjectInsight);

app.get('/oauth/authCode', oauth_rawt.requestAuthCode);
app.get('/oauth/receiveAuthToken', oauth_rawt.receiveAuthCode);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});