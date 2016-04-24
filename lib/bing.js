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

    // Use camelCased options
    // Note: this translation is needed for compatibility with older versions.
    //   At some point it could be deprecated and removed in a major version
    opts.newsSortBy = opts.newsSortBy || opts.newssortby || null;
    opts.newsCategory = opts.newsCategory || opts.newscategory || null;
    opts.newsLocationOverride = opts.newsLocationOverride
                                  || opts.newslocationoverride
                                  || null;
    opts.imageFilters = opts.imageFilters || opts.imagefilters || null;
    opts.videoSortBy = opts.videoSortBy || opts.videosortby || null;
    opts.videoFilters = opts.videoFilters || opts.videofilters || null;

    var reqUri = opts.rootUri
    + vertical
    + "?$format=json&" + qs.stringify({ "Query": "'" + query + "'" })
    + "&$top=" + opts.top
    + "&$skip=" + opts.skip
    + "&Options=%27" + (opts.options || []).join('%2B') + "%27"
    + (opts.sources
        ? "&Sources=%27" + encodeURIComponent(opts.sources) + "%27"
        : '')
    + (opts.newsSortBy ? "&NewsSortBy=%27" + opts.newsSortBy + "%27" : '')
    + (opts.newsCategory ? "&NewsCategory=%27" + opts.newsCategory + "%27" : '')
      + (opts.newsLocationOverride
          ? "&NewsLocationOverride=%27" + opts.newsLocationOverride + "%27"
        : '')
    + (opts.market ? "&Market=%27" + opts.market + "%27" : '')
    + (opts.adult ? "&Adult=%27" + opts.adult + "%27" : '')
    + (opts.imageFilters
        ? '&' + qs.stringify({ "ImageFilters": "'" + opts.imageFilters + "'" })
        : '')
    + (opts.videoSortBy ? "&VideoSortBy=%27" + opts.videoSortBy + "%27" : '')
    + (opts.videoFilters
        ? '&' + qs.stringify({ "VideoFilters": "'" + opts.videoFilters + "'" })
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
 *                                    userAgent, reqTimeout, top, skip
 *
 * @param {requestCallback} callback  Callback called with (potentially
 *                                    json-parsed) response.
 *
 * @function
 */
Bing.prototype.web = function (query, options, callback) {
  this.searchVertical(query, "Web", options, callback);
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
 *                                    userAgent, reqTimeout, top, skip,
 *
 * @param {requestCallback} callback  Callback called with (potentially
 *                                    json-parsed) response.
 * @function
 */
Bing.prototype.composite = function (query, options, callback) {
  this.searchVertical(query, "Composite", options, callback);
};

/**
 * Performs a Bing search in the News vertical.
 *
 * @param {String} query              Query term to search for.
 *
 * @param {Object} options            Options to command, allows overriding
 *                                    of rootUri, accKey (Bing API key),
 *                                    userAgent, reqTimeout, top, skip,
 *
 * @param {requestCallback} callback  Callback called with (potentially
 *                                    json-parsed) response.
 * @function
 */
Bing.prototype.news = function (query, options, callback) {
  this.searchVertical(query, "News", options, callback);
};

/**
 * Performs a Bing search in the Video vertical.
 *
 * @param {String} query              Query term to search for.
 *
 * @param {Object} options            Options to command, allows overriding
 *                                    of rootUri, accKey (Bing API key),
 *                                    userAgent, reqTimeout, top, skip,
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
  this.searchVertical(query, "Video", options, callback);
};



/**
 * Performs a Bing search in the Images vertical.
 *
 * @param {String} query              Query term to search for.
 *
 * @param {Object} options            Options to command, allows overriding of
 *                                    rootUri, accKey (Bing API key),
 *                                    userAgent, reqTimeout, top, skip,
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
  this.searchVertical(query, "Image", options, callback);
};


/**
 * Performs a Bing search in the Related Search vertical.
 *
 * @param {String} query              Query term to search for.
 *
 * @param {Object} options            Options to command, allows overriding
 *                                    of rootUri, accKey (Bing API key),
 *                                    userAgent, reqTimeout, top, skip,
 *
 * @param {requestCallback} callback  Callback called with (potentially
 *                                    json-parsed) response.
 * @function
 */
Bing.prototype.relatedSearch = function (query, options, callback) {
  this.searchVertical(query, "RelatedSearch", options, callback);
};


/**
 * Performs a Bing search in the Spelling Suggestions vertical.
 *
 * @param {String} query              Query term to search for.
 *
 * @param {Object} options            Options to command, allows overriding
 *                                    of rootUri, accKey (Bing API key),
 *                                    userAgent, reqTimeout, top, skip,
 *
 * @param {requestCallback} callback  Callback called with (potentially
 *                                    json-parsed) response.
 * @function
 */
Bing.prototype.spelling = function (query, options, callback) {
  this.searchVertical(query, "SpellingSuggestions", options, callback);
};



/**
 * Capitalises the first word of the passed string
 *
 * @param {String} s   String to be capitalised
 *
 * @funtion
 */
function capitalise(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}


module.exports = Bing;

