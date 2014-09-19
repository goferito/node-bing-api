
/*********************************************************
 *  Simple Node.js module for using the Bing Search API  *
 *********************************************************/

// Require dependencies
var request = require('request'),
    url = require('url'),
    _ = require('underscore'),
    qs = require('querystring');


var Bing = function( options ) {

    if( !(this instanceof Bing) ) return new Bing( options );

    var defaults = {

        //Bing Search API URI
        rootUri: "https://api.datamarket.azure.com/Bing/Search/Web",
        //TODO move the web part, to choose also Images

        //Account Key
        accKey: null,
 
        //Bing UserAgent
        userAgent: 'Bing Search Client for Node.js',

        //Request Timeout
        reqTimeout: 5000
    };

    //merge options passed in with defaults
    this.options = _.extend(defaults, options)
}


Bing.prototype.search = function(query, callback, options) {

  if(typeof callback != 'function') {
    throw "Error: Callback function required!";
  }

  // TODO check if valid options

  var opts = this.options;

  if(options != null) {
    opts = _.extend(this.options, options)
  }

  var reqUri = opts.rootUri
                 + "?$format=json&"
                 + qs.stringify({ "Query": "'" + query + "'" })

  request({
    uri: reqUri,
    method: opts.method || "GET",
    headers: {
      "User-Agent": opts.userAgent
    },
    auth: {
      user: opts.accKey,
      pass: opts.accKey
    },
    timeout: opts.reqTimeout

  }, function(err, res, body){

    // Parse body, if body
    body = typeof body === 'string'
             ? JSON.parse(body)
             : body;

    callback(err, res, body);
  });
};

module.exports = Bing;
