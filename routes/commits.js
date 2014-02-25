var FeedParser = require('feedparser');
var https = require('https');
var url = require('url');

var rest = require('../services/rest');
var arch = require('../services/architecture');

var ghOptions = {
    host: 'github.com',
    port: 443,
    auth: "pffreitas:101811jp",
    headers: {
        'User-Agent': 'Synchro-Rabbit'
    }
};


function doSomeJmx() {
    var jmx = require("jmx");

    var client = jmx.createClient({
        service: "service:jmx:rmi:///jndi/rmi://localhost:1098/server",
        username: 'jsmith',
        password: 'foo'
    });

    client.connect();
    client.on("connect", function () {
        console.log(client.javaJmx);
        client.listMBeans(function (data) {

            /*
                client.getAttribute(data[d], "", function (data) {
                    console.log(data);
                });
                */
        });
    });
}

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
            response.json(inspectCommitFiles(data));
        },
        function (err) {
            response.send(500);
        });
}

function inspectCommitFiles(json) {

    var grailsArch = arch.getArchitecture('grails');
    grailsArch.inspectFiles(json.files);

    return json;
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