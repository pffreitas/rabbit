var http = require('http');
var querystring = require('querystring');
var url = require('url');

var consumerKey = 'ID-345232313231383938353736786d';
var consumerSecret = 'S-39333632313231383938353736336934';

var baseUrl = 'http://localhost:8180/synchro-oauth-provider/',
    authUrl = '/synchro-oauth-provider/OAuth2/auth',
    tokenUrl = "/synchro-oauth-provider/OAuth2/token";

var payload = {
    "client_id": consumerKey,
    "client_secret": consumerSecret,
    "redirect_uri": "http://localhost:3000/oauth/receiveAuthToken"
}

exports.requestAuthCode = function (req, response) {

    payload.scope = "openid";
    payload.state = "-2";
    payload.nonce = "-1";


    var options = {
        protocol: 'http',
        hostname: 'localhost',
        port: 8180,
        pathname: authUrl,
        search: querystring.stringify(payload)
    };

    var requestAuthCodeUrl = url.format(options);
    response.redirect(requestAuthCodeUrl);
}

exports.receiveAuthCode = function (req, response) {
    var authCode = req.query.code

    payload.grant_type = "authorization_code";
    payload.code = authCode;

    var options = {
        hostname: 'localhost',
        port: 8180,
        path: tokenUrl + "?" + querystring.stringify(payload),
        method: "GET"
    };

    post(options, function (r, d) {
        response.send(d);
    }, function (e) {
        console.log("error: ", e);
        response.send(500, e);
    });
}

function post(options, onResult, onError) {
    var prot = options.port == 443 ? https : http;
    var req = prot.request(options, function (res) {
        var output = '';
        console.log(options.host + ':' + res.statusCode);

        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function () {
            onResult(res, output);
        });
    });

    req.on('error', function (err) {
        onError(err);
    });



    req.end();
}