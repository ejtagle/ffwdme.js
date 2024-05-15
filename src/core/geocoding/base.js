var Class = require('../class');

var Base = Class.extend({
  /**
   * desc
   *
   * @class The class represents a base client for a geocoding service.
   *   You can't use this class directly but must use a child class,
   *   which has implemented the abstract method: fetch.
   *
   * @augments ffwdme.Class
   * @constructs
   *
   *
   */
  constructor: function(options) {
    this.options = options;

    var attrs = ['address'], attr;
    for(var i = 0, len = attrs.length; i < len; i++) {
      attr = attrs[i];
      this[attr] = options && options[attr];
    }

    return this;
  },

  options: null,

  /**
   * The last successful point response.
   *
   * @type ffwdme.LatLng
   */
  lastPoint: null,

  // must trigger start event, as a result is must call either success or error
  fetch: function() {
    throw 'ffwdme.geocoding.Base is an abstract class. You must use a child class.';
  },

  eventPrefix: function() {
    return 'geocoding';
  },

  success: function(response, point) {
    this.lastPoint = point;
    ffwdme.trigger(this.eventPrefix() + ':success', {
      geocoding: this,
      point: point,
      response: response
    });
  },

  error: function(error) {
    ffwdme.trigger(this.eventPrefix() + ':error', {
      geocoding: this,
      error: error
    });
  }
});

module.exports = Base;
