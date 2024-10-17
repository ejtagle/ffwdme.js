var Base = require('../base');

var Zoom = Base.extend({

  constructor: function(options) {
    this.base(options);
    this.render();
  },

  classname: "Zoom",

  attrAccessible: ['map', 'grid'],

  iconElZoomIn: null,

  iconElZoomOut: null,

  iconZoomIn: 'zoom/plus.svg',

  iconZoomOut: 'zoom/minus.svg',

  classes: 'ffwdme-components-container ffwdme-components-zoom-container ffwdme-clickable',

  zoom: function(val){
    this.map && this.map.changeUserZoom(val);
    ffwdme.geolocation.last && ffwdme.trigger('geoposition:update', ffwdme.geolocation.last);
  },

  setIcons: function() {
    var img;

    if (!this.iconElZoomOut) {
      img = document.createElement('img');
      this.iconElZoomOut = $(img).addClass('ffwdme-components-zoom').appendTo($(this.el));
    }
    this.iconElZoomOut[0].src = this.getImageUrl(this.iconZoomOut);

      if (!this.iconElZoomIn) {
          img = document.createElement('img');
          this.iconElZoomIn = $(img).addClass('ffwdme-components-zoom').appendTo($(this.el));
      }
      this.iconElZoomIn[0].src = this.getImageUrl(this.iconZoomIn);

  },

  make: function(){
    this.base();
    var self = this;
    this.setIcons();
    $(this.iconElZoomIn).click(function(e) { e.stopPropagation(); self.zoom(1);});
    $(this.iconElZoomOut).click(function(e) { e.stopPropagation(); self.zoom(-1);});
    return this;
  }

});

module.exports = Zoom;
