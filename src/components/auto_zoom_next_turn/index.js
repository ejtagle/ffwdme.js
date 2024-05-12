var Base = require('../base');

var AutoZoomNextTurn = Base.extend({

    constructor: function (options) {
        this.base(options);

        this.bindAll(this, 'onRoute');
        ffwdme.on('navigation:onroute', this.onRoute);
    },

    classname: "AutoZoomNextTurn",

    attrAccessible: ['map'],

    cachedZoomLevel: null,

    cachedZoomCount: 0,

    zoomLevelByDistanceToTurn: function (distance) {

        if (distance < 120) {
            return 18;
        } else if (distance < 240) {
            return 17;
        } else if (distance < 700) {
            return 16;
        } else if (distance < 960) {
            return 15;
        } else {
            return 14;
        }
    },

    onRoute: function (e) {


        if (!this.map.canControlMap(this)) return;

        var distance = e.navInfo.distanceToNextDirection;
        var zoom = this.zoomLevelByDistanceToTurn(distance);

        if (this.cachedZoomLevel != zoom) {
            this.cachedZoomLevel = zoom;
            this.cachedZoomCount = 0;
            return;
        }

        if (this.cachedZoomCount < 2) return this.cachedZoomCount++;

        this.map.setZoom(zoom);
    }
});

module.exports = AutoZoomNextTurn;
