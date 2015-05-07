
/*********************************************************
 *  Simple Node.js module for using the Bing Search API  *
 *********************************************************/

// Require dependencies
var request = require('request'),
    url = require('url'),
    _ = require('underscore'),
    qs = require('querystring');

/**
 * @param {Object} options  Options to all Bing calls, allows overriding of
 *        rootUri, accKey (Bing API key), userAgent, reqTimeout
 * @returns {Bing}
 * @constructor
 */
var Bing = function( options ) {

  if( !(this instanceof Bing) ) return new Bing( options );

  var defaults = {

    //Bing Search API URI
    rootUri: "https://api.datamarket.azure.com/Bing/Search/v1/",

    //Account Key
    accKey: null,

    //Bing UserAgent
    userAgent: 'Bing Search Client for Node.js',

    //Request Timeout
    reqTimeout: 5000,

    // Number of results (limited to 50 by API)
    top: 50,

    // Number of skipped results (pagination)
    skip: 0

  };

  //merge options passed in with defaults
  this.options = _.extend(defaults, options);

  this.searchVertical = function(query, vertical, callback, options) {

    if(typeof callback != 'function') {
      throw "Error: Callback function required!";
    }

    // Create a copy of the options, to avoid permanent overwrites
    var opts = JSON.parse(JSON.stringify(this.options));

    _.extend(opts, options);

    var reqUri = opts.rootUri
                   + vertical
                   + "?$format=json&"
                   + qs.stringify({ "Query": "'" + query + "'" })
                   + "&$top=" + opts.top
                   + "&$skip=" + opts.skip
                   + (opts.sources ? "&Sources=%27" + opts.sources + "%27" : '')
                   + (opts.newssortby ? "&NewsSortBy=%27" + opts.newssortby + "%27" : '')
                   + (opts.newscategory ? "&NewsCategory=%27" + opts.newscategory + "%27" : '')
                   + (opts.newslocationoverride ? "&NewsLocationOverride=%27" + opts.newslocationoverride + "%27" : '')
                   + (opts.market ? "&Market=%27" + opts.market + "%27" : '')
                   + (opts.adult  ? "&Adult=%27"  + opts.adult  + "%27" : '')
                   + (opts.imagefilters 
                       ? '&' + qs.stringify({ "ImageFilters": "'" + opts.imagefilters + "'" })
                       : '')
                   + (opts.videofilters
                     ? '&' + qs.stringify({ "VideoFilters": "'" + opts.videofilters + "'" })
                     : '');

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

      if(res && res.statusCode !== 200){
        err = new Error(body);
      }else{

        // Parse body, if body
        body = typeof body === 'string'
                 ? JSON.parse(body)
                 : body;
      }

      callback(err, res, body);
    });
  };

};


/**
 * @callback requestCallback
 * @param {String} error     Error evaluates to true when an error has occurred.
 * @param {Object} response  Response object from the Bing call.
 * @param {Object} body      JSON of the response.
 */


/**
 * Performs a Bing search in the Web vertical.
 *
 * @param {String} query              Query term to search for.
 *
 * @param {requestCallback} callback  Callback called with (potentially
 *                                    json-parsed) response.
 *
 * @param {Object} options            Options to command, allows overriding
 *                                    of rootUri, accKey (Bing API key),
 *                                    userAgent, reqTimeout, top, skip
 * @function
 */
Bing.prototype.web = function(query, callback, options) {
    this.searchVertical(query, "Web", callback, options);
};

// Alias Bing.search to Bing.web
// Note: Keep this for compatibility with older versions
Bing.prototype.search = Bing.prototype.web;


/**
 * Performs a Bing search in the Composite vertical.
 *
 * @param {String} query              Query term to search for.
 *
 * @param {requestCallback} callback  Callback called with (potentially
 *                                    json-parsed) response.
 *
 * @param {Object} options            Options to command, allows overriding
 *                                    of rootUri, accKey (Bing API key),
 *                                    userAgent, reqTimeout, top, skip,
 * @function
 */
Bing.prototype.composite = function(query, callback, options) {
  this.searchVertical(query, "Composite", callback, options);
};

/**
 * Performs a Bing search in the News vertical.
 *
 * @param {String} query              Query term to search for.
 *
 * @param {requestCallback} callback  Callback called with (potentially
 *                                    json-parsed) response.
 *
 * @param {Object} options            Options to command, allows overriding
 *                                    of rootUri, accKey (Bing API key),
 *                                    userAgent, reqTimeout, top, skip,
 * @function
 */
Bing.prototype.news = function(query, callback, options) {
  this.searchVertical(query, "News", callback, options);
};

/**
 * Performs a Bing search in the Video vertical.
 *
 * @param {String} query              Query term to search for.
 *
 * @param {requestCallback} callback  Callback called with (potentially
 *                                    json-parsed) response.
 *
 * @param {Object} options            Options to command, allows overriding
 *                                    of rootUri, accKey (Bing API key),
 *                                    userAgent, reqTimeout, top, skip,
 * @function
 */
Bing.prototype.video = function(query, callback, options) {
  if (options
    && options.videofilters
    && typeof options.videofilters === 'object') {
    var filterQuery = '';
    var filters = Object.keys(options.videofilters);
    filters.map(function(key, i) {
      filterQuery += capitalizeFirstLetter(key) + ':';
      filterQuery += capitalizeFirstLetter(options.videofilters[key]);
      if (i < filters.length - 1)
        filterQuery += '+';
    });
    options.videofilters = filterQuery;
  }
  this.searchVertical(query, "Video", callback, options);
};



/**
 * Performs a Bing search in the Images vertical.
 *
 * @param {String} query              Query term to search for.
 *
 * @param {requestCallback} callback  Callback called with (potentially
 *                                    json-parsed) response.
 *
 * @param {Object} options            Options to command, allows overriding of
 *                                    rootUri, accKey (Bing API key),
 *                                    userAgent, reqTimeout, top, skip,
 *                                    imagefilters
 * @function
 */
Bing.prototype.images = function(query, callback, options) {
    if (options 
        && options.imagefilters 
        && typeof options.imagefilters === 'object') {
      var filterQuery = '';
      var filters = Object.keys(options.imagefilters);
      filters.map(function(key, i) {
        filterQuery += capitalizeFirstLetter(key) + ':';
        filterQuery += capitalizeFirstLetter(options.imagefilters[key]);
        if (i < filters.length - 1)
          filterQuery += '+';
      });
      options.imagefilters = filterQuery;
    }
    this.searchVertical(query, "Image", callback, options);
};

function capitalizeFirstLetter(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

module.exports = Bing;

