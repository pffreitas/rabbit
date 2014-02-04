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
    doSomeJmx();

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
    var commitUrl = url.parse(commit.url);

    ghOptions.host = commitUrl.host;
    ghOptions.path = commitUrl.path;

    rest.getJSON(
        ghOptions,
        function (status, data) {
            response.json(data);
        },
        function (err) {
            response.send(500);
        });
}