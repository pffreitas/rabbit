var http = require('http');
var https = require('https');
var querystring = require('querystring');
var url = require('url');

var consumerKey = 'ID-345232313231383938353736786d';
var consumerSecret = 'S-39333632313231383938353736336934';

var authUrl = 'OAuth2/auth',
    tokenUrl = "OAuth2/token";


var payload = {
    "redirect_uri": "http://ca180:3000/oauth/receiveAuthToken"
}


exports.requestAuthCode = function (req, response) {

    req.session.oauthProviderLocation = url.parse(req.query.l);
    var opl = req.session.oauthProviderLocation;

    payload.client_id = req.query.client_id;
    payload.client_secret = req.query.client_secret;
    payload.scope = "openid";
    payload.state = "-2";
    payload.nonce = "-1";

    var options = {
        protocol: opl.protocol,
        hostname: opl.hostname,
        port: opl.port,
        pathname: opl.pathname + authUrl,
        search: querystring.stringify(payload)
    };

    var requestAuthCodeUrl = url.format(options);
    response.send(requestAuthCodeUrl);
}

exports.receiveAuthCode = function (req, response) {
    var authCode = req.query.code

    var opl = req.session.oauthProviderLocation;

    payload.grant_type = "authorization_code";
    payload.code = authCode;

    var options = {
        protocol: opl.protocol,
        hostname: opl.hostname,
        port: opl.port,
        path: opl.pathname + tokenUrl + "?" + querystring.stringify(payload),
        method: "GET"
    };
    console.log(options);
    post(options, function (r, d) {
        var donut = JSON.parse(d);
        response.send(d);
    }, function (e) {
        console.log("error: % o ", e);
        response.send(500, e);
    });
}

function post(options, onResult, onError) {
    var prot = options.protocol === 'https:' ? https : http;

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