var BaseIcon = require('../base_icon');

var ArrivalTime = BaseIcon.extend({

  classname: "ArrivalTime",

  icon: 'arrival_time/clock.svg',

  classes: 'ffwdme-grid-w3 ffwdme-grid-h1 ffwdme-info',

  defaultUnit: 'Uhr',

    constructor: function(options) {

      if (options && typeof options.defaultUnit !== 'undefined') this.defaultUnit = options.defaultUnit;

        this.base(options);

    },

  format: function(date) {
    var min = date.getMinutes();
    return [ date.getHours(), min > 10 ? min : ("0" + min) ].join(':');
  },

  navigationOnRoute: function(e) {
    var timeLeft = e.navInfo.timeToDestination;
    if (!timeLeft) return;

    var now = (new Date()).valueOf(),
        then = new Date(now + timeLeft * 1000);

     this.label(this.format(then));
  }
});

module.exports = ArrivalTime;
