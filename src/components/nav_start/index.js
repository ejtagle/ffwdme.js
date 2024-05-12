var Base = require('../base');

var NavStart = Base.extend({

    constructor: function (options) {
        this.base(options);

        this.render();

        this.bindAll(this, 'onGeopositionUpdate');

        ffwdme.on('geoposition:update', this.onGeopositionUpdate);
        ffwdme.on('routecalculation:start', this.onRouteStart);
        ffwdme.on('routecalculation:error', this.onRouteError);
        ffwdme.on('routecalculation:success', this.onRouteSuccess);

        this.setOpacity();
    },

    classname: "NavStart",

    navStarted: false,
    currentCoordinates: null,
    destination: null,

    attrAccessible: ['map', 'grid'],

    iconEl: null,

    icon: 'nav_start/start.svg',

    iconNavStop: 'nav_start/stop.svg',

    iconNavStart: 'nav_start/start.svg',

    classes: 'ffwdme-components-container ffwdme-grid-w2 ffwdme-grid-h1 ffwdme-components-nav-start ffwdme-clickable',

    toggleNavStart: function (e) {

        this.icon = (this._toggleNavStart()) ? this.iconNavStop : this.iconNavStart;

        if (this.navStarted) {
            console.log('Fetching Route');
                var route = new ffwdme.routingService({
                    start: { lat: this.currentCoordinates.latitude, lng: this.currentCoordinates.longitude },
                    dest:  { lat: this.destination.latitude, lng: this.destination.longitude }
                }).fetch();
        } else {
            console.log("Stopping Route");
            this.map.removeRouteFromMap();
            ffwdme.navigation.stop();
        }

        this.setIcon();
        this.setOpacity();

    },

    _toggleNavStart: function() {

        this.navStarted = !this.navStarted;
        return this.navStarted;

    },

    clearDestination: function () {

        this.destination = null;
        this.setOpacity();

    },

    setDestination: function (latitude, longitude) {

        this.destination = {"latitude": latitude, "longitude": longitude};
        this.setOpacity();

    },

    imgUrl: function () {
        return this.getRetinaImageUrl(ffwdme.defaults.imageBaseUrl + this.icon);
    },

    setOpacity: function () {
        var widgets = $(".ffwdme-components-container");
        if (this.navStarted) {
            widgets.removeClass("ffwdme-nav-idle");
        } else {
            widgets.addClass("ffwdme-nav-idle");
        }

        if (this.destination === null || this.currentCoordinates === null) {
            $(this.el).addClass('ffwdme-nav-no-dest');
        } else {
            $(this.el).removeClass('ffwdme-nav-no-dest');
        }
    },

    setIcon: function () {
        if (!this.iconEl) {
            var img = document.createElement('img');
            this.iconEl = $(img).addClass('ffwdme-components-nav-start-image').appendTo($(this.el));
        }
        this.iconEl[0].src = this.imgUrl();
    },

    make: function () {
        this.base();
        var self = this;
        $(this.el).click(function (e) {
            e.stopPropagation();
            self.toggleNavStart();
        });
        this.setIcon();
        return this;
    },

    onGeopositionUpdate: function(e) {

        /*
          Coordinates {
            accuracy: 20
            altitude: null
            altitudeAccuracy: null
            heading: null
            latitude: 51.5135262
            longitude: -0.2274957
            speed: null
          }
         */

        var oldCoordinates = this.currentCoordinates;
        this.currentCoordinates = e.geoposition.coords;

        if (oldCoordinates === null && this.currentCoordinates !== null) this.setOpacity();

    },

    onRouteStart: function(data) {
        console.info('routing started');
    },

    onRouteError: function(data) {
        console.error('routing FAILED');
    },

    onRouteSuccess: function(response) {
        console.info('routing SUCCESSFULL!');
        console.dir(response);
        ffwdme.navigation.setRoute(response.route).start();
    },


});

module.exports = NavStart;
