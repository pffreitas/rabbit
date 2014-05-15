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

exports.markAsReaded = function (req, response) {
    ghOptions.host = 'api.github.com';
    ghOptions.path = '/repos/Syncchro/' + req.params.project + '/commits/' + req.params.sha + '/comments';

    var data = {
        body: "Marked as reviewed in " + new Date()
    }
    data = JSON.stringify(data);
    console.log(data);

    function success(status, data) {
        response.json(inspectCommitFiles(data));
    }

    function error(err) {
        response.send(500);
    }

    rest.getJSON(ghOptions, success, error, data);
}