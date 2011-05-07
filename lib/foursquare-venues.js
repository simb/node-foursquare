/**
 * A CommonJS module for interfacing with Foursquare.
 * @module node-foursquare-venues
 * @exports Foursquare
 * @version 0.1
 * @author Clint Andrew Hall
 * @author Simeon Bateman <simeon@simb.net>
 */
var qs = require('querystring'),
  sys = require("sys"),
  https = require('https'),
  urlParser = require('url'),
  log4js = require("log4js")(),
  logger = log4js.getLogger("node-foursquare"),
  defaultConfig = {
    "apiUrl" : "https://api.foursquare.com/v2"
  };


/**
 *
 * @param config
 * @namespace
 */
var Foursquare = function(config) {
  config = config || defaultConfig;
  
  var emptyCallback = function() { }, api = {
    
    /**
     * @namespace
     * @memberOf Foursquare
     */
    "Venues" : {},
    
    /**
     * @namespace
     * @memberOf Foursquare
     */
    "Tips" : {},
    
  };

  if(!config.clientId || !config.clientSecret || !config.apiUrl) {
    throw new TypeError("Supplied configuration is invalid.");
  }

  function retrieve(url, callback) {
    callback = callback || emptyCallback;

    var parsedUrl = urlParser.parse(url, true), request, result = "";

    if(parsedUrl.protocol == "https:" && !parsedUrl.port) {
      parsedUrl.port = 443;
    }

    if(parsedUrl.query === undefined) {
      parsedUrl.query = {};
    }
    var path = parsedUrl.pathname + "?" + qs.stringify(parsedUrl.query);
    logger.debug("Requesting: " + path);
    request = https.request({
      "host" : parsedUrl.hostname,
      "port" : parsedUrl.port,
      "path" : path,
      "method" : "GET",
      "headers" : {
        "Content-Length": 0
      }
    }, function(res) {
      res.on("data", function(chunk) {
        result += chunk;
      });
      res.on("end", function() {
        callback(null, res.statusCode, result);
      });
    });
    request.on("error", function(error) {
      logger.error("Error calling remote host: " + error.message);
      callback(error);
    });

    request.end();
  }

  function invokeAPI(url, callback) {

    callback = callback || emptyCallback;

    retrieve(url,
      function(error, status, result) {
        if(error) {
          callback(error);
        }
        else {
          callback(null, status, result);
        }
      });
  }

  function extractData(status, result, field, callback) {
    var json;
    callback = callback || emptyCallback;

    if(status !== undefined && result !== undefined) {
      try {
        json = JSON.parse(result);
      }
      catch(e) {
        callback(e);
        return;
      }

      if(json.meta && json.meta.code === 200) {
        if(json.response !== undefined && json.response[field] !== undefined) {
          callback(null, json.response[field]);
        }
        else {
          callback(null, {});
        }
      }
      else if(json.meta) {
        logger.error("JSON Response had unexpected code: \"" + json.meta.code + ": " + json.meta.errorDetail + "\"");
        callback(new Error(json.meta.code + ": " + json.meta.errorDetail));
      }
      else {
        callback(new Error("Response had no code: " + sys.inspect(json)));
      }
    }
  }

  function callApi(path, field, params, callback) {

    var url = config.apiUrl + path;

    if(params) {
	
      if((params.lat && !params.lng) || (!params.lat && params.lng)) {
        callback(new Error("parameters: if you specify a longitude or latitude, you must include BOTH."));
        return;
      }

      if(params.lat && params.lng) {
        params.ll = params.lat + "," + params.lng;
        delete params.lat;
        delete params.lng;
      }

      url += "?" + qs.stringify(params) + "&";
    }else{
		url += "?";
	}

	url += "client_id=" + config.clientId + "&client_secret=" + config.clientSecret;      
	logger.trace("URL: " + url);
	
    invokeAPI(url, function(error, status, result) {
      extractData(status, result, field, callback);
    });
  }

  /**
   * Search Foursquare Venues.
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {String|Number} [params.lat] The latitude of the location around which to search.
   * @param {String|Number} [params.lng] The longitude of the location around which to search.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @name search
   * @function
   * @memberOf Foursquare.Venues
   * @see https://developer.foursquare.com/docs/venues/search.html
   */
  api.Venues.search = function(params, callback) {
    callApi("/venues/search", "groups", params || {}, callback);
  };

  /**
   * Return Foursquare Venues near location with the most people currently checked in. 
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {String|Number} [params.lat] The latitude of the location around which to search.
   * @param {String|Number} [params.lng] The longitude of the location around which to search.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @name getTrending
   * @function
   * @memberOf Foursquare.Venues
   * @see https://developer.foursquare.com/docs/venues/trending.html
   */
  api.Venues.getTrending = function(params, callback) {
    callApi("/venues/trending", "venues", params || {}, callback);
  };


  /**
   * Retrieve a Foursquare Venue.
   * @param {String} venueId The id of a Foursquare Venue.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @name getVenue
   * @function
   * @memberOf Foursquare.Venues
   * @see https://developer.foursquare.com/docs/venues/venues.html
   */
  api.Venues.getVenue = function(venueId, callback) {
    if(!venueId) {
      callback(new Error("getVenue: venueId is required."));
      return;
    }
    callApi("/venues/" + venueId, "venue", null, callback);
  };

  /**
   *
   * @param {String} venueId The id of a Foursquare Venue.
   * @param {String} aspect The aspect to retrieve. Refer to Foursquare documentation for details on currently
   * supported aspects.
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @name getVenueAspect
   * @function
   * @memberOf Foursquare.Venues
   * @see https://developer.foursquare.com/docs/index_docs.html
   */
  api.Venues.getVenueAspect = function(venueId, aspect, params, callback) {
    if(!venueId) {
      callback(new Error("getVenueAspect: venueId is required."));
      return;
    }
    if(!aspect) {
      callback(new Error("getVenueAspect: aspect is required."));
      return;
    }
    callApi("/venues/" + venueId + '/' + aspect, aspect, params || {}, callback);
  };

  /**
   * Retrieve Check-ins for Users who are at a Venue "now".
   * @param {String} venueId The id of a Foursquare Venue.
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @name getHereNow
   * @function
   * @memberOf Foursquare.Venues
   * @see https://developer.foursquare.com/docs/venues/herenow.html
   */
  api.Venues.getHereNow = function(venueId, params, callback) {
    api.Venues.getVenueAspect(venueId, "herenow", params, callback)
  };

  /**
   * Retrieve Tips for a Foursquare Venue.
   * @param {String} venueId The id of a Foursquare Venue.
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @name getTips
   * @function
   * @memberOf Foursquare.Venues
   * @see https://developer.foursquare.com/docs/venues/tips.html
   */
  api.Venues.getTips = function(venueId, params, callback) {
    api.Venues.getVenueAspect(venueId, "tips", params, callback)
  };

  /**
   * Retrieve Photos for a Foursquare Venue.
   * @param {String} venueId The id of a Foursquare Venue.
   * @param {String} [group="checkin"] The type of photos to retrieve. Refer to Foursquare documentation for details
   * on currently supported groups.
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @name getPhotos
   * @function
   * @memberOf Foursquare.Venues
   * @see https://developer.foursquare.com/docs/venues/photos.html
   */
  api.Venues.getPhotos = function(venueId, group, params, callback) {
    params = params || {};
    params.group = group || "checkin";
    api.Venues.getVenueAspect(venueId, "photos", params, callback)
  };

  /**
   * Retrieve Links for a Foursquare Venue.
   * @param {String} venueId The id of a Foursquare Venue.
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @name getLinks
   * @function
   * @memberOf Foursquare.Venues
   * @see https://developer.foursquare.com/docs/venues/links.html
   */
  api.Venues.getLinks = function(venueId, params, callback) {
    api.Venues.getVenueAspect(venueId, "links", params, callback)
  };

  
  api.Tips.getTip = function(tipId, callback) {
    if(!tipId) {
      callback(new Error("getTip: tipId is required."));
      return;
    }
    callApi("/tips/" + tipId, "tip", null, callback);
  };

  /**
   * 
   * @param {Object} [params] An object containing additional parameters. Refer to Foursquare documentation for details
   * on currently supported parameters.
   * @param {Function} callback The function to call with results, function({Error} error, {Object} results).
   * @name search
   * @function
   * @memberOf Foursquare.Tips
   * @see http://developer.foursquare.com/docs/tips/search.html
   */
  api.Tips.search = function(params, callback) {
    callApi("/tips/search", "tips", params || {}, callback);
  };

  return api;
};

exports.Foursquare = Foursquare;