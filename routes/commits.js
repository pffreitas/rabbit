var FeedParser = require('feedparser');
var https = require('https');
var url = require('url');

var rest = require('../services/rest');

var ghOptions = {
    host: 'github.com',
    port: 443,
    auth: "pffreitas:101811jp",
    headers: {
        'User-Agent': 'Synchro-Rabbit'
    }
};

exports.listCommits = function (req, response) {
    var data = [];

    ghOptions.host = 'api.github.com';
    ghOptions.path = '/repos/Syncchro/' + req.params.project + '/commits';

    rest.getJSON(
        ghOptions,
        function (status, data) {
            response.json(data);
        },
        function (err) {
            response.send(500);
        });
}

exports.spotCommit = function (req, response) {
    var commit = req.body;

    ghOptions.host = 'api.github.com';
    ghOptions.path = '/repos/Syncchro/' + req.params.project + '/commits/' + req.params.sha;

    rest.getJSON(
        ghOptions,
        function (status, data) {
            response.json(data);
        },
        function (err) {
            response.send(500);
        });
}