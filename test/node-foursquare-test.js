var   sys = require('sys')
	, express = require('express')
	, assert = require('assert')
	, logger = require("log4js")().getLogger("node-foursquare-test");

var   fsq = require('./../lib/node-foursquare')
	, config = require('./config').config
	, Foursquare = fsq.Foursquare(config);

function TestSuite() {
    var Tests = {
        "Venues": {},
        "Tips": {}
        
    };

	
    Tests.Venues.search = function() {
        var query = {
            "lat": "40.7",
            "lng": "-74"
        };
        Foursquare.Venues.search(query, function(error, data) {
            if (error) {
                logger.error("Foursquare.Venues.search \033[22;31mERROR: " + error.message);
            }
            else {
                try {
                    //logger.trace(sys.inspect(data));
                    assert.equal(data[0].type, "trending");
                    logger.info("Foursquare.Venues.search(lat: 40.7, lng: -74) : \033[22;32mOK");
                } catch(error) {
                    logger.error("Foursquare.Venues.search \033[22;31mERROR: " + error.message);
                }
            }
        });
    };
	
    Tests.Venues.getTrending = function() {
        var query = {
            "lat": "40.7",
            "lng": "-74"
        };
        Foursquare.Venues.getTrending(query, function(error, data) {
            if (error) {
                logger.error("Foursquare.Venues.getTrending \033[22;31mERROR: " + error.message);
            }
            else {
                try {
                   // logger.trace(sys.inspect(data));
                    assert.ok(data[0].hereNow.count > 0);
                    logger.info("Foursquare.Venues.getTrending(lat: 40.7, lng: -74) : \033[22;32mOK");
                } catch(error) {
                    logger.error("Foursquare.Venues.getTrending \033[22;31mERROR: " + error.message);
                }
            }
        });
    };
	
	
    Tests.Venues.getVenue = function() {
        Foursquare.Venues.getVenue(5104, function(error, data) {
            if (error) {
                logger.error("Foursquare.Venues.getVenue \033[22;31mERROR: " + error.message);
            }
            else {
                try {
                    //logger.trace(sys.inspect(data));
                    assert.equal(data.id, "40a55d80f964a52020f31ee3");
                    logger.info("Foursquare.Venues.getVenue(5104) : \033[22;32mOK");
                } catch(error) {
                    logger.error("Foursquare.Venues.getVenue \033[22;31mERROR: " + error.message);
                }
            }
        });
    };
	
    Tests.Venues.getHereNow = function() {
        Foursquare.Venues.getHereNow(5104, null,
        function(error, data) {
            if (error) {
                logger.error("Foursquare.Venues.getHereNow \033[22;31mERROR: " + error.message);
            }
            else {
                try {
                    //logger.trace(sys.inspect(data));
                    assert.ok(data);
                    logger.info("Foursquare.Venues.getHereNow(5104) : \033[22;32mOK");
                } catch(error) {
                    logger.error("Foursquare.Venues.getHereNow \033[22;31mERROR: " + error.message);
                }
            }
        });
    };
	
    Tests.Venues.getTips = function() {
        Foursquare.Venues.getTips(5104, null,
        function(error, data) {
            if (error) {
                logger.error("Foursquare.Venues.getTips \033[22;31mERROR: " + error.message);
            }
            else {
                try {
                   // logger.trace(sys.inspect(data));
                    assert.ok(data);
                    logger.info("Foursquare.Venues.getTips(5104) : \033[22;32mOK");
                } catch(error) {
                    logger.error("Foursquare.Venues.getTips \033[22;31mERROR: " + error.message);
                }
            }
        });
    };
	
    Tests.Venues.getPhotos = function() {
        Foursquare.Venues.getPhotos(5104, null,
        function(error, data) {
            if (error) {
                logger.error("Foursquare.Venues.getPhotos \033[22;31mERROR: " + error.message);
            }
            else {
                try {
                    logger.trace(sys.inspect(data));
                    assert.ok(data);
                    logger.info("Foursquare.Venues.getPhotos(5104) : \033[22;32mOK");
                } catch(error) {
                    logger.error("Foursquare.Venues.getPhotos \033[22;31mERROR: " + error.message);
                }
            }
        });
    };

    Tests.Venues.getLinks = function() {
        Foursquare.Venues.getLinks(5104, null,
        function(error, data) {
            if (error) {
                logger.error("Foursquare.Venues.getLinks \033[22;31mERROR: " + error.message);
            }
            else {
                try {
                    //logger.trace(sys.inspect(data));
                    assert.ok(data);
                    logger.info("Foursquare.Venues.getLinks(5104) : \033[22;32mOK");
                } catch(error) {
                    logger.error("Foursquare.Venues.getLinks \033[22;31mERROR: " + error.message);
                }
            }
        });
    };

   

    Tests.Tips.getTip = function() {
        Foursquare.Tips.getTip("4b5e662a70c603bba7d790b4",
        function(error, data) {
            if (error) {
                logger.error("Foursquare.Tips.getTip \033[22;31mERROR: " + error.message);
            }
            else {
                try {
                    //logger.trace(sys.inspect(data));
                    assert.ok(data);
                    logger.info("Foursquare.Tips.getTip(4b5e662a70c603bba7d790b4) : \033[22;32mOK");
                } catch(error) {
                    logger.error("Foursquare.Tips.getTip \033[22;31mERROR: " + error.message);
                }
            }
        });
    };
	
    Tests.Tips.search = function() {
        var query = {
            "lat": "40.7",
            "lng": "-74"
        };

        Foursquare.Tips.search(query.lat,query.lng, null,
        function(error, data) {
            if (error) {
                logger.error("Foursquare.Tips.search \033[22;31mERROR: " + error.message);
            }
            else {
                try {
                    //logger.trace(sys.inspect(data));
                    assert.ok(data);
                    logger.info("Foursquare.Tips.search(lat: 40.7, lng: -74) : \033[22;32mOK");
                } catch(error) {
                    logger.error("Foursquare.Tips.search \033[22;31mERROR: " + error.message);
                }
            }
        });
    };

  
	
	
    return {
        "Tests": Tests,
        "execute": function(testGroup, testName) {
            for (var group in Tests) {
                if (!testGroup || (testGroup && testGroup == group)) {
                    for (var test in Tests[group]) {
                        if (!testName || (testName && testName == test)) {
                            var t = Tests[group][test];
                            if (t && typeof(t) == "function") {
                                logger.debug("Running: " + test);
                                t.call(this);
                            }
                        }
                    }
                }
            }
        }
    }
}

TestSuite().execute();

