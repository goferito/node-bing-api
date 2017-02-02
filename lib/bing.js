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
var Bing = function (options) {

  if (!(this instanceof Bing)) return new Bing(options);

  var defaults = {

    //Bing Search API URI
    rootUri: "https://api.cognitive.microsoft.com/bing/v5.0/",

    //Account Key
    accKey: null,

    //Bing UserAgent
    userAgent: 'Bing Search Client for Node.js',

    //Request Timeout
    reqTimeout: 5000
  };

  // Merge options passed in with defaults
  this.options = _.extend(defaults, options);


  // Performs the search request for the given vertical
  this.searchVertical = function (query, vertical, options, callback) {

    if (typeof options === 'function') {
      callback = options;
    }
    if (typeof callback != 'function') {
      throw "Error: Callback function required!";
    }

    // Create a copy of the options, to avoid permanent overwrites
    var opts = JSON.parse(JSON.stringify(this.options));

    if (typeof options === 'object') {
      _.extend(opts, options);
    }

    // Map options and supported variation for old versions with the new names
    var opMap = {
      top: 'count',
      skip: 'offset',
      videosortby: 'videoSortBy',
      videofilters: 'videoFilters',
      adult: 'safeSearch',
      safesearch: 'safeSearch',
      market: 'mkt'
    }
    Object.keys(opts).forEach(function (opt) {
      var newOp = opMap[opt]
      if (newOp) {
        opts[newOp] = opts[newOp] || opts[opt]
        delete opts[opt]
      }
    })

    var reqUri = opts.rootUri + vertical + "?q=" + query

    // Filter the no-query options (accKey, rootUri, userAgent)
    var queryOpts = {}

    Object.keys(opts).forEach(function (opt) {
      if (!~Object.keys(defaults).indexOf(opt)) {
        queryOpts[opt] = opts[opt]
      }
    })

    var qStr = qs.stringify(queryOpts);

    reqUri += qStr ? '&' + qStr : '';

    request({
      uri: reqUri,
      method: opts.method || "GET",
      headers: {
        "User-Agent": opts.userAgent,
        "Ocp-Apim-Subscription-Key": opts.accKey
      },
      timeout: opts.reqTimeout,
      pool: {
        maxSockets: opts.maxSockets ? opts.maxSockets : Infinity
      }

    }, function (err, res, body) {

      if (res && res.statusCode !== 200) {
          err = new Error(body);
      } else {

        // Parse body, if body
        body = typeof body === 'string' ? JSON.parse(body) : body;
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
 * @param {Object} options            Options to command, allows overriding
 *                                    of rootUri, accKey (Bing API key),
 *                                    userAgent, reqTimeout, count, offset
 *
 * @param {requestCallback} callback  Callback called with (potentially
 *                                    json-parsed) response.
 *
 * @function
 */
Bing.prototype.web = function (query, options, callback) {
  this.searchVertical(query, "search", options, callback);
};

// Alias Bing.search to Bing.web
// Note: Keep this for compatibility with older versions
Bing.prototype.search = Bing.prototype.web;


/**
 * Performs a Bing search in the Composite vertical.
 *
 * @param {String} query              Query term to search for.
 *
 * @param {Object} options            Options to command, allows overriding
 *                                    of rootUri, accKey (Bing API key),
 *                                    userAgent, reqTimeout, count, offset,
 *
 * @param {requestCallback} callback  Callback called with (potentially
 *                                    json-parsed) response.
 * @function
 */
Bing.prototype.composite = function (query, options, callback) {
  this.searchVertical(query, "search", options, callback);
};

/**
 * Performs a Bing search in the News vertical.
 *
 * @param {String} query              Query term to search for.
 *
 * @param {Object} options            Options to command, allows overriding
 *                                    of rootUri, accKey (Bing API key),
 *                                    userAgent, reqTimeout, count, offset,
 *
 * @param {requestCallback} callback  Callback called with (potentially
 *                                    json-parsed) response.
 * @function
 */
Bing.prototype.news = function (query, options, callback) {
  this.searchVertical(query, "news/search", options, callback);
};

/**
 * Performs a Bing search in the Video vertical.
 *
 * @param {String} query              Query term to search for.
 *
 * @param {Object} options            Options to command, allows overriding
 *                                    of rootUri, accKey (Bing API key),
 *                                    userAgent, reqTimeout, count, offset,
 *
 * @param {requestCallback} callback  Callback called with (potentially
 *                                    json-parsed) response.
 * @function
 */
Bing.prototype.video = function (query, options, callback) {
  if (options && typeof options === 'object') {

    //compatibility with older versions
    options.videoFilters = options.videoFilters || options.videofilters || '';

    if (options.videoFilters && typeof options.videoFilters === 'object') {

      var filterQuery = Object.keys(options.videoFilters)
                          .map(function(key){
                            return capitalise(key) + ':'
                                     + capitalise(options.videoFilters[key]);
                          })
                          .join('+');

      options.videoFilters = filterQuery;
    }
  }
  this.searchVertical(query, "videos/search", options, callback);
};



/**
 * Performs a Bing search in the Images vertical.
 *
 * @param {String} query              Query term to search for.
 *
 * @param {Object} options            Options to command, allows overriding of
 *                                    rootUri, accKey (Bing API key),
 *                                    userAgent, reqTimeout, count, offset,
 *                                    imageFilters
 *
 * @param {requestCallback} callback  Callback called with (potentially
 *                                    json-parsed) response.
 * @function
 */
Bing.prototype.images = function (query, options, callback) {
  if (options && typeof options === 'object') {

    //compatibility with older versions
    options.imageFilters = options.imageFilters || options.imagefilters || '';

    if (options.imageFilters && typeof options.imageFilters === 'object') {

      var filterQuery = Object.keys(options.imageFilters)
                          .map(function(key){
                            return capitalise(key) + ':'
                                     + capitalise(options.imageFilters[key]);
                          })
                          .join('+');

      options.imageFilters = filterQuery;
    }
  }
  this.searchVertical(query, "images/search", options, callback);
};


/**
 * Performs a Bing search in the Related Search vertical.
 *
 * @param {String} query              Query term to search for.
 *
 * @param {Object} options            Options to command, allows overriding
 *                                    of rootUri, accKey (Bing API key),
 *                                    userAgent, reqTimeout, count, offset,
 *
 * @param {requestCallback} callback  Callback called with (potentially
 *                                    json-parsed) response.
 * @function
 */
Bing.prototype.relatedSearch = function (query, options, callback) {
  this.searchVertical(query, "search", options, callback);
};


/**
 * Performs a Bing search in the Spelling Suggestions vertical.
 *
 * @param {String} query              Query term to search for.
 *
 * @param {Object} options            Options to command, allows overriding
 *                                    of rootUri, accKey (Bing API key),
 *                                    userAgent, reqTimeout, count, offset,
 *
 * @param {requestCallback} callback  Callback called with (potentially
 *                                    json-parsed) response.
 * @function
 */
Bing.prototype.spelling = function (query, options, callback) {
  this.searchVertical(query, "spellcheck", options, callback);
};



/**
 * Capitalises the first word of the passed string
 *
 * @param {String} s   String to be capitalised
 *
 * @function
 */
function capitalise(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}


module.exports = Bing;

