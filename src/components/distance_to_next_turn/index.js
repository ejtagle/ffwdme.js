var BaseWide = require('../base_wide');
var DistanceToDestination = require('../distance_to_destination');

var DistanceToNextTurn = BaseWide.extend({

  classname: "DistanceToNextTurn",

  classes: 'ffwdme-components-container ffwdme-components-text-only ffwdme-info',

  format: DistanceToDestination.prototype.format,

  navigationOnRoute: function(e) {
    var distance = e.navInfo.distanceToNextDirection;
    if (!distance) return;

    var formatted = this.format(distance);
    $(this.el).find('.ffwdme-components-text').html([formatted.distance, formatted.unit].join(' '));
  }
});

module.exports = DistanceToNextTurn;
