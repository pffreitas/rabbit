var FeedParser = require('feedparser');
var https = require('https');

exports.fetchNews = function(req, eres){
  var feedMeta;
  var pushes = [];

  var options = {
    host: 'github.com',
    port: 443,   
    auth: "pffreitas:101811jp",    
    path: '/pffreitas.private'
  };
  
  var ghreq = https.get(options, function(res) {
    res.pipe(new FeedParser({}))
      .on('error', function(error){
          eres.send(500);
      })
      .on('meta', function(meta){
          // Store the metadata for later use
          feedMeta = meta;
      })
      .on('readable', function(){
          var stream = this, item;
          while (item = stream.read()){
                var push = {
                    'title': item.title,
                    'summary': item.summary,
                    'description': item.description,
                };
                pushes.push(push);
          }
      })
      .on('end', function(){
         console.log("feedMeta : " + JSON.stringify(feedMeta));
         var feed = {
              'feedName': feedMeta.title,
              'website': feedMeta.link,
              'pushes': pushes
          }
          
          eres.json({feed: feed});
     });
  });  
  
  
}

exports.index = function(req, eres){
  eres.render('index', { title: 'Freita\'s Dashboard'}); 
};