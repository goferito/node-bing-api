var validWebResponse = {
  "d": {
    "results": [{
      "__metadata": {
        "uri": "https://api.datamarket.azure.com/Data.ashx/Bing/Search/Web?Query='xbox'&$skip=0&$top=1",
        "type": "WebResult"
      },
      "ID": "26888c2a-d245-47dc-87de-dc3551249de7",
      "Title": "Xbox | Games and Entertainment on All Your Devices",
      "Description": "Experience the new generation of games and entertainment with Xbox. Play Xbox games and stream video on all your devices.",
      "DisplayUrl": "www.xbox.com",
      "Url": "http://www.xbox.com/"
    }, {
      "__metadata": {
        "uri": "https://api.datamarket.azure.com/Data.ashx/Bing/Search/Web?Query='xbox'&$skip=1&$top=1",
        "type": "WebResult"
      },
      "ID": "ff23e110-31c2-44f9-be21-f213bcd4c654",
      "Title": "Amazon.com: Xbox - More Systems: Video Games: Games ...",
      "Description": "Online shopping for Video Games from a great selection of Games, Hardware, Computer And Console Video Game Products & more at everyday low prices.",
      "DisplayUrl": "www.amazon.com/Xbox-Games/b?ie=UTF8&node=537504",
      "Url": "http://www.amazon.com/Xbox-Games/b?ie=UTF8&node=537504"
    }],
    "__next": "https://api.datamarket.azure.com/Data.ashx/Bing/Search/Web?Query='xbox'&$skip=2"
  }
};

var should = require('should'),
    express = require('express'),
    http = require('http'),
    request = require('request'),
    bing = require('../lib/bing');

describe('Bing', function () {
  var server;
  var app;
  var port = 4321;

  before(function (done) {
    app = express();
    server = http.createServer(app);
    server.listen.apply(server, [port,
                        function (err, result) {
                          if (err) {
                            done(err);
                          } else {
                            done();
                          }
                        }
    ]);
  });

  after(function (done) {
    server.close();
    app = null;
    server = null;
    done();
  });

  it('should cope with valid responses', function (done) {

    app.get('/hello/Web', function (req, res) {
      res.status(200).send(JSON.stringify(validWebResponse));
    });

    var bingClient = bing({
      rootUri: 'http://localhost:' + port + '/hello/',
      accKey: '123'
    });

    bingClient.search('xbox', function (error, response, body) {
      response.statusCode.should.eql(200);
      body.should.eql(validWebResponse);
      done();
    });
  });

  it('should cope with errors', function (done) {

    // No actual data on what the failure looks like.
    var failure = {
      message: 'Failed request'
    };

    app.get('/hello/Image', function (req, res) {
      res.status(500).send(failure);
    });
    
    var bingClient = bing({
      rootUri: 'http://localhost:' + port + '/hello/',
      accKey: '123'
    });

    bingClient.images('xbox', function (error, response, body) {
      response.statusCode.should.eql(500);
      body.should.eql(JSON.stringify(failure));
      done();
    });
  });
});
