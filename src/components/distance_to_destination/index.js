var BaseIcon = require('../base_icon');

var DistanceToDestination = BaseIcon.extend({

  classname: "DistanceToDestination",

  icon: 'distance_to_destination/road.svg',

  classes: 'ffwdme-grid-w3 ffwdme-grid-h1 ffwdme-components-icon ffwdme-info',

  defaultUnit: 'km',

  format: function(distance) {
    var unit = ' m';

    // 1243 m = 1.2 km
    if (distance > 10000) {
      distance = (distance/1000).toFixed(0);
      unit = ' km';
    // 859 m = 900 m
    } else if (distance > 500) {
      distance = (distance/1000).toFixed(1) * 1000;
    // 123 m = 120 m
    } else {
      distance = (distance/1000).toFixed(2) * 1000;
    }

    return {
      distance: distance,
      unit: unit
    };
  },

  navigationOnRoute: function(e) {
    var distance = e.navInfo.distanceToDestination;
    if (!distance) return;

    var formatted = this.format(distance);

    this.label(formatted.distance);
    this.unit(formatted.unit);
  }
});

module.exports = DistanceToDestination;
