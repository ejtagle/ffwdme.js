var Base = ffwdme.Class.extend({

  constructor: function(options) {
    this.options = options || {};
    this.setAccessibleAttributes();

    if (this.onResize) {
      this.bindAll(this, 'onResize');
      $(window).bind('resize', this.onResize);
    }

    if (this.onOrientationChange) {
      this.bindAll(this, 'onOrientationChange');
      $(window).bind('orientationchange', this.onOrientationChange);
    }

    if (!ffwdme.components.Base.testElement) {
      this.createTestElement();
      $(window).bind('orientationchange', ffwdme.components.Base.updateOrientationClass);
      // TODO: create a trigger for this
      window.setTimeout(ffwdme.components.Base.updateOrientationClass, 200);
    }

    if (this.options.classes) {
        if (this.classes === null) this.classes = "";
        this.classes += " " + this.options.classes;
    }
  },

  classname: "Base",

  classes: null,

  grid: null,

  $: function(selector) {
    return $(selector, this.el);
  },

  attrAccessible: ['el', 'grid'],

  setAccessibleAttributes: function() {
    var attributes = this.attrAccessible;
    for (var i = -1, l = attributes.length, attr; attr = attributes[++i],i < l;) {
      if (typeof this.options[attr] !== 'undefined') this[attr] = this.options[attr];
    }
  },

  make: function(){
    this.el = document.createElement('div');
    if (this.options.css) $(this.el).css(this.options.css);

    $(this.el).addClass(this.classes);
    this.setPosition();
    return this;
  },

  setPosition: function() {
    var grid = this.grid;
    if (!grid) return;
    var el = $(this.el);

	// Set position
    el.addClass('ffwdme-grid-x' + grid.x);
    el.addClass('ffwdme-grid-y' + grid.y);
	
	// remove any width classes
	var w = grid.w;
	if (!w) w = 1;
	el.attr('class',
		function(i, c){
			return c.replace(/(^|\s)ffwdme-grid-w\S+/g, '');
		});
	el.addClass('ffwdme-grid-w' + w);

	var h = grid.h;
	if (!h) h = 1;

	// remove any height classes
	el.attr('class',
		function(i, c){
			return c.replace(/(^|\s)ffwdme-grid-h\S+/g, '');
		});
	el.addClass('ffwdme-grid-h' + h);
  },

  createTestElement: function() {
    ffwdme.components.Base.testElement = $(document.createElement('div'))
      .addClass('ffwdme-components-test-size ffwdme-components-container ffwdme-grid-h1')
      .appendTo($('.ffwdme-components-wrapper'));

    // var lastHeight = null;
    // var updateHeights = function(){
    //   var el = ffwdme.components.Base.testElement;
    //   var testHeight = parseInt(el.height(), 10);
    //   if (lastHeight != testHeight) {
    //     $('.ffwdme-components-container').not(el).css({ fontSize: testHeight+ "px", lineHeight: testHeight + "px" })
    //   }
    //   lastHeight = testHeight;
    // };

    // $(window).bind('resize', updateHeights);
    // TODO: create a trigger for this
    // window.setTimeout(updateHeights, 200);
  },

  render: function(){
    if (!this.el) this.make();
    $(this.options.parent).append(this.el);
    return this;
  },

  getImageUrl: function(imgPath){
	if (imgPath == '')
		return '';
	var root = document.getElementById("imgcache");
	if (root != null) {
		var parts = imgPath.split('/');
		var len = parts.length;
		for (var i=0; i < len-1; ++i) {
			root = root.querySelector('div[name="'+parts[i]+'"]');
			if (root == null)
				break;
		}
		if (root != null) {
			root = root.querySelector('img[name="'+parts[len-1]+'"]');
			if (root != null)
				return root.src;
		}
	}
	  
    if (!!document.createElementNS &&
      !!document.createElementNS('http://www.w3.org/2000/svg', "svg").createSVGRect){
      return ffwdme.defaults.imageBaseUrl + imgPath;
    } else {
      return ffwdme.defaults.imageBaseUrl + imgPath.replace("svg", "png");
    }
  }
}, {
  testElement: null,

  updateOrientationClass: function() {
    var orientation = ffwdme.components.Base.determineOrientationClass();
    $('.ffwdme-components-container').removeClass('landscape portrait').addClass(orientation);
  },

  determineOrientationClass: function() {
    var orientation;

    if (typeof window.orientation === 'undefined') {
      orientation = 'portrait';
    } else if (window.orientation === 0 || window.orientation === 180) {
      orientation = 'portrait';
    } else if (window.orientation === 90 || window.orientation === -90) {
      orientation = 'landscape';
    }

    return orientation;
  }

});

module.exports = Base;
