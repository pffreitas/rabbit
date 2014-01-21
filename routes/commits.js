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

exports.fetchNews = function(req, eres){
  var feedMeta;
  var pushes = [];

  ghOptions.path = '/pffreitas.private'
  
  https.get(ghOptions, function(res) {
    res.pipe(new FeedParser({}))
      .on('error', function(error){ eres.send(500); })
      .on('meta', function(meta){ feedMeta = meta; })
      .on('readable', function(){
          var stream = this, item;
          while (item = stream.read()){
            var push = {
              'title': item.title,
              'link': item.link,
              'summary': item.summary,
              'description': item.description,
            };
            pushes.push(push);
          }
      })
      .on('end', function(){
         var feed = {
            'feedName': feedMeta.title,
            'website': feedMeta.link,
            'pushes': pushes
          }
          
          eres.json({feed: feed});
     });
  });  
}

