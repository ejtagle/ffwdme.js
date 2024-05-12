var BaseWide = require('../base_wide');

var NextStreet = BaseWide.extend({

    classname: "NextStreet",

    announceDist: 150,

    classes: 'ffwdme-components-container ffwdme-components-text-only ffwdme-grid-w9 ffwdme-grid-h1 ffwdme-info',

  showNextStreet: function(e) {
    $(this.el).find('.ffwdme-components-text')
      .html(e.navInfo.nextDirection.street)
      .css('background', '');
  },

  showFinalStreet: function(e) {
    $(this.el).find('.ffwdme-components-text')
      .html(e.navInfo.currentDirection.street);
  },

  navigationOnRoute: function(e) {
    if (e.navInfo.finalDirection === true) {
      this.showFinalStreet(e);
    } else if (e.navInfo.nextDirection && e.navInfo.nextDirection.street && e.navInfo.distanceToNextDirection < this.announceDist) {
      this.showNextStreet(e);
    } else {
      this.showFinalStreet(e); // this shows current street
    }
  }
});

module.exports = NextStreet;
