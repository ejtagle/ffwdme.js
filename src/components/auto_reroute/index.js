var Base = require('../base');

var AutoReroute = Base.extend({

  constructor: function(options) {
    this.base(options);
    this.lastPositions = [];

    this.bindAll(this, 'onRoute', 'offRoute', 'start', 'success', 'error', 'cachePositions');

    ffwdme.on('reroutecalculation:start', this.start);
    ffwdme.on('reroutecalculation:success', this.success);
    ffwdme.on('reroutecalculation:error', this.error);
    ffwdme.on('navigation:onroute', this.onRoute);
    ffwdme.on('navigation:offroute', this.offRoute);
    ffwdme.on('geoposition:update', this.cachePositions);

    this.render();
  },

  classname: "AutoReroute",

  classes: 'ffwdme-components-container ffwdme-components-statusbar',

  offRouteCounter: 0,

  lastPositions: null,

  isRerouting: false,

  hideTimeout: null,

  status: {
    off: {
      message: 'Off planned route',
      css: 'red'
    },
    start: {
      message: 'Recalculating route ...',
      css: 'yellow'
    },
    success: {
      message: 'Rerouted',
      css: 'green'
    }
  },

  cachePositions: function(e) {
    this.lastPositions = this.lastPositions.splice(-5);
    this.lastPositions.push(e.point);
  },

  show: function(){
    if (this.hideTimeout) clearTimeout(this.hideTimeout);
    $(this.el).show();
  },

  hide: function(delay) {
      if (typeof delay === 'undefined') delay = 3000;

      var me = this;
    this.hideTimeout = setTimeout(function(){
        me.removeClasses();
    }, delay);
  },

  removeClasses: function() {
      $(this.el).removeClass('green').removeClass('yellow').removeClass('red');//.hide();
    },

  onRoute: function() {
    $(this.el).hide();
  },

  offRoute: function() {
    this.offRouteCounter++;
    var state = this.status.off;
    this.removeClasses();
    $(this.el).addClass(state.css).text(state.message).show();
    if (this.offRouteCounter <= 15 || this.isRerouting) return;

    if (this.lastPositions.length) {
      ffwdme.navigation.reroute({
        anchorPoint: this.lastPositions[0]
      });
      this.lastPositions = [];
    } else {
      ffwdme.navigation.reroute();
    }
  },

  start: function() {
    this.isRerouting = true;
    var state = this.status.start;
    this.removeClasses();
    $(this.el).addClass(state.css).text(state.message).show();
  },

  success: function() {
    this.isRerouting = false;
    this.offRouteCounter = 0;
    var state = this.status.success;
    this.removeClasses();
    $(this.el).addClass(state.css).text(state.message).show();//.hide();
    this.hide(3000);
  },

  error: function() {
  }
});

module.exports = AutoReroute;
