var FeedParser = require('feedparser');
var https = require('https');

var rest = require('../services/rest');

var ghOptions = {
  host: 'github.com',
  port: 443,   
  auth: "pffreitas:101811jp",
  headers: { 'User-Agent': 'Synchro-Rabbit' }
};

exports.listCommits = function(req, response){
  var data = [];
  
  ghOptions.host = 'api.github.com';
  ghOptions.path = '/repos/Syncchro/synchro-integration/commits';
  
  rest.getJSON(
               ghOptions,
               function(status, data){
                  response.json(data);
               },             
               function(err){
                  response.send(500);
              });
}


