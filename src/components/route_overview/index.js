var Base = require('../base');

var RouteOverview = Base.extend({

  constructor: function(options) {
    this.base(options);
    this.render();
  },

  classname: "RouteOverview",

  attrAccessible: ['map', 'grid'],

  iconEl: null,

  icon: 'route_overview/map.svg',

  iconPosition: 'route_overview/position.svg',

  iconRouteOverview: 'route_overview/map.svg',

  classes: 'ffwdme-components-container ffwdme-components-route-overview ffwdme-clickable',

  toggleOverview: function(e){
    if (!this.map || !this.map.canControlMap(this)) return;

    this.icon = (this.map.toggleRouteOverview()) ? this.iconPosition : this.iconRouteOverview;
    this.setIcon();
    this.setOpacity();

    setTimeout(function() {
        ffwdme.geolocation.last && ffwdme.trigger('geoposition:update', ffwdme.geolocation.last);
    }, 200);
  },

  setOpacity: function(){
    var widgets = $(".ffwdme-components-container");
    if (this.map.inRouteOverview){
      widgets.addClass("ffwdme-in-route-overview");
    }else{
      widgets.removeClass("ffwdme-in-route-overview");
    }
  },

  setIcon: function() {
    if (!this.iconEl) {
      var img = document.createElement('img');
      this.iconEl = $(img).addClass('ffwdme-components-route-overview-image').appendTo($(this.el));
    }
    this.iconEl[0].src = this.getImageUrl(this.icon);
  },

  make: function(){
    this.base();
    var self = this;
    $(this.el).click(function(e) { e.stopPropagation(); self.toggleOverview(); });
    this.setIcon();
    return this;
  }

});

module.exports = RouteOverview;
