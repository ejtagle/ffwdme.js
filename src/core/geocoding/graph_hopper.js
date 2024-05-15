var Base = require('./base');

var GraphHopper = Base.extend({
  /**
   * Creates a new instance of the GraphHopper geocoding service class.
   * When doing so, this object adds itself as the a global handler for geocoding
   * responses.
   *
   * Options:
   * - apiKey
   *
   * @class The class represents a client for the ffwdme geocoding service
   * using GraphHopper.
   *
   * @augments ffwdme.Class
   * @constructs
   *
   */
  constructor: function(options) {
    this.base(options);
    this.bindAll(this, 'parse', 'error');

    this.apiKey = ffwdme.options.graphHopper.apiKey;

    if (options.anchorPoint) {
      this.anchorPoint = options.anchorPoint;
    }
  },

  /**
   * The base url for the service.
   *
   * @type String
   */
  BASE_URL: 'https://graphhopper.com/api/1/',

  // set via constructor
  apiKey: null,

  locale: 'en',

  point: null,

  anchorPoint: null,

  fetch: function() {

    ffwdme.trigger(this.eventPrefix() + ':start', { geocoding: this });

	var self = this;
	var parms = new URLSearchParams({
	  q: this.address,
	  locale: this.locale,
	  limit: '1',
	  reverse: 'false',
	  debug: 'false',
	  provider: 'default',
	  key: this.apiKey
	});
	
	if (this.anchorPoint != null)
		parms.set("point", this.anchorPoint.lat.toString()+','+this.anchorPoint.lng.toString());
	
	const reqUrl = this.BASE_URL+'geocode?'+parms.toString();

	var req = new XMLHttpRequest();   // new HttpRequest instance 
	req.open("GET", reqUrl);
	req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	req.overrideMimeType("application/json");
	req.onreadystatechange = function () {
		if (req.readyState === 4) {
			if (req.status === 200) {
				console.log("Success:"+req.responseText);
				self.parse(JSON.parse(req.responseText));
			} else {
				console.log("Error", req.statusText);
				self.error(req.statusText);
			}
		}
	};
	req.timeout = 4000;
	req.ontimeout = function () { 
		self.error("Timed out"); 
	}
	req.send();

    return ffwdme;
  },

  error: function(error) {
    this.base(error);
  },

  parse: function(response) {

    // check for error codes
	if (response.hits.length == 0) return this.error(response);

    var address = response.hits[0].point;

    this.point = new ffwdme.LatLng(address.lat, address.lng);

    this.success(response, this.point);
  }
 
});

module.exports = GraphHopper;
