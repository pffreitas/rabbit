var http = require("http");
var https = require("https");

/**
 * getJSON:  REST get request returning JSON object(s)
 * @param options: http options object
 * @param callback: callback to pass the results JSON object(s) back
 */
exports.getJSON = function (options, onResult, onError, data) {
    console.log("rest::getJSON");

    if (data) {
        options.method = "POST";
    }

    var prot = options.port == 443 ? https : http;
    var req = prot.request(options, function (res) {
        var output = '';
        console.log(options.host + ':' + res.statusCode);

        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function () {
            var json = JSON.parse(output);
            onResult(res.statusCode, json);
        });
    });

    req.on('error', function (err) {
        onError(err);
    });

    if (data) {
        req.write(data);
    }

    req.end();
};