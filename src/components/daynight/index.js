var Base = require('../base');
var DayNight = Base.extend({

  constructor: function(options) {
    this.base(options);
    this.bindAll(this, 'toggleDayNight');

    this.render();
  },

  classname: "DayNight",

  lastAction: '',

  icon: 'daynight/daynight.svg',

  classes: 'ffwdme-components-container ffwdme-clickable',

  logoEl: null,

  iconEl: null,

  setIcon: function() {
    if (!this.iconEl) {
      var img = document.createElement('img');
      this.iconEl = $(img).addClass('ffwdme-components-daynight').appendTo($(this.el));
    }

    this.iconEl[0].src = this.getImageUrl(this.icon);
  },

  toggleDayNight: function(e){
	
	$('.leaflet-layer').toggleClass('night-mode-filter');

    this.setIcon();
  },

  make: function(){
    this.base();
    var self = this;
    $(this.el).click(function(e) { e.stopPropagation(); self.toggleDayNight(); });

    this.setIcon();
    return this;
  }
});

module.exports = DayNight; // done
