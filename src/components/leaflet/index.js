var Base = require('../base');

var Leaflet = Base.extend({
    /**
     * Max Zoom is 18
     * @augments ffwdme.Class
     * @constructs
     *
     */
    constructor: function (options) {

		this.startIcon = this.getImageUrl('leaflet/map_marker_start.png'),
		this.startShadow = this.getImageUrl('leaflet/map_marker_shadow.png'),
        this.finishIcon = this.getImageUrl('leaflet/map_marker_finish.png'),
        this.finishShadow = this.getImageUrl('leaflet/map_marker_shadow.png'),

        this.base(options);
        this.bindAll(this, 'resize', 'drawRoute', 'drawMarkerWithoutRoute', 'onRouteSuccess', 'navigationOnRoute', 'navigationOffRoute', 'rotateMarker', 'setupMap');

        Leaflet.defineLeafletExtensions();

        this.mapReadyCallbacks = [];

        this.setupMap();

        ffwdme.on('geoposition:update', this.drawMarkerWithoutRoute);
        ffwdme.on('routecalculation:success', this.onRouteSuccess);
        ffwdme.on('routecalculation:success', this.drawRoute);
        ffwdme.on('reroutecalculation:success', this.drawRoute);
    },

    classname: "Leaflet",

    attrAccessible: ['el', 'apiKey', 'minZoom', 'maxZoom', 'startIcon', 'startShadow', 'finishIcon', 'finishShadow'],

	startIcon: null,

	startShadow: null,

    finishIcon: null,

    finishShadow: null,

    minZoom: 10,

    maxZoom: 18,

    map: null,

    polylines: null,

    helpLine: null,

    marker: null,

    markerIcon: null,

    zoomLevel: 17,

    inRoutingMode: false,

    inRouteOverview: false,

    doneRouteOverview: false,

    mapReady: false,

    mapReadyCallbacks: null,

    userZoom: 0,

    additionalBounds: null,

    canControlMap: function (component) {
        if (component instanceof ffwdme.components.AutoZoom && this.inRouteOverview) {
            return false;
        }
        if (component instanceof ffwdme.components.AutoZoomNextTurn && this.inRouteOverview) {
            return false;
        }
        if (component instanceof ffwdme.components.MapRotator && this.inRouteOverview) {
            return false;
        }
        if (component instanceof ffwdme.components.MapRotatorCompass && this.inRouteOverview) {
            return false;
        }
        return true;
    },

    setupEventsOnMapReady: function () {
        ffwdme.on('navigation:onroute', this.navigationOnRoute);
        ffwdme.on('navigation:offroute', this.navigationOffRoute);
        ffwdme.on('geoposition:update', this.rotateMarker);
    },

    setupMap: function () {
        var destination = new L.LatLng(this.options.center.lat, this.options.center.lng);

        this.map = new L.Map(this.el.attr('id'), {
            attributionControl: false,
            zoomControl: false
        });

        L.tileLayer(this.options.tileURL, {
            minZoom: this.minZoom,
            maxZoom: this.maxZoom
        }).addTo(this.map);

        if (!this.options.disableLeafletLocate) {
            this.map.locate({setView: true, maxZoom: 17});
        }

        this.setupEventsOnMapReady();

        for (var i = 0; i < this.mapReadyCallbacks.length; i++) {
            this.mapReadyCallbacks[i]();
        }

        this.mapReadyCallbacks = [];

        this.mapReady = true;
    },

    hideMarker: function () {
        this.marker && $(this.marker._icon).hide();
    },

    rotateMarker: function (e) {
        var heading = e.geoposition.coords.heading;
        if (!isNaN(heading) && heading !== null && this.marker) {
            this.marker.setIconAngle(heading);
        }
    },

    drawMarkerWithoutRoute: function (e) {
        if (this.inRoutingMode) return;

        var markerIcon;

        if (!this.marker) {
            markerIcon = new L.Icon({
                iconUrl: this.getImageUrl('leaflet/map_marker.png'),
                shadowUrl: this.getImageUrl('leaflet/map_marker_shadow.png'),
                iconSize: new L.Point(40, 40),
                shadowSize: new L.Point(40, 40),
                iconAnchor: new L.Point(20, 20),
                popupAnchor: new L.Point(-3, -76)
            });

            this.marker = new L.Compass(e.point, {icon: markerIcon});
            this.disableMarker || this.map.addLayer(this.marker);
        } else {
            this.drawMarkerOnMap(e.point.lat, e.point.lng, true);
        }
    },

    drawRoute: function (e) {
        if (!this.mapReady) {
            var self = this;
            this.mapReadyCallbacks.push(function () {
                self.removeHelpLine();
                self.drawPolylineOnMap(e.route, false);
            });
            return;
        }


        this.removeHelpLine();
        this.drawPolylineOnMap(e.route, false);
    },

    onRouteSuccess: function (e) {
        this.inRoutingMode = true;

        var start = e.route.start();

        var startMarkerIcon = new L.Icon({
            iconUrl: this.startIcon,
            shadowUrl: this.startShadow,
            iconSize: new L.Point(40, 40),
            shadowSize: new L.Point(40, 40),
            iconAnchor: new L.Point(20, 35),
            popupAnchor: new L.Point(-3, -76)
        });

        this.startMarker = new L.Marker(start, {icon: startMarkerIcon});
        this.map.addLayer(this.startMarker);
		
        var destination = e.route.destination();

        var finishMarkerIcon = new L.Icon({
            iconUrl: this.finishIcon,
            shadowUrl: this.finishShadow,
            iconSize: new L.Point(40, 40),
            shadowSize: new L.Point(40, 40),
            iconAnchor: new L.Point(12, 32),
            popupAnchor: new L.Point(-3, -76)
        });

        this.finishMarker = new L.Marker(destination, {icon: finishMarkerIcon});
        this.map.addLayer(this.finishMarker);
    },

    navigationOnRoute: function (e) {
        var p = e.navInfo.position;
        this.removeHelpLine();
        this.drawMarkerOnMap(p.lat, p.lng, true);
    },

    navigationOffRoute: function (e) {
        var p = e.navInfo.positionRaw;		
		if (p == null || e.navInfo.position == null)
			return;
        this.drawMarkerOnMap(p.lat, p.lng, true);
        this.drawHelpLine(p, e.navInfo.position);
    },
    removeRouteFromMap: function () {
        if (this.polylines) {
            this.map.removeLayer(this.polylines.underlay);
            this.map.removeLayer(this.polylines.overlay);
            this.polylines = null;
            this.map.removeLayer(this.finishMarker);
        }
    },

    drawPolylineOnMap: function (route, center) {
        var directions = route.directions, len = directions.length, len2, path;

        var point, latlngs = [];
        for (var i = 0; i < len; i++) {
            if (directions[i].path) {
                path = directions[i].path;
                len2 = path.length;
                for (var j = 0; j < len2; j++) {
                    latlngs.push(new L.LatLng(path[j].lat, path[j].lng));
                }
            }
        }

        if (!this.polylines) {
            this.polylines = {};

            this.polylines.underlay = new L.Polyline(latlngs, {color: 'crimson', opacity: 1, weight: 8});
            this.polylines.overlay = new L.Polyline(latlngs, {color: 'cornsilk', opacity: 1, weight: 4});

            this.map.addLayer(this.polylines.underlay);
            this.map.addLayer(this.polylines.overlay);
        } else {
            this.polylines.underlay.setLatLngs(latlngs);
            this.polylines.overlay.setLatLngs(latlngs);
        }

        // zoom the map to the polyline
        var mapBounds = new L.LatLngBounds(latlngs);
        if (this.additionalBounds !== null) {
            mapBounds.extend(this.additionalBounds.getSouthWest());
            mapBounds.extend(this.additionalBounds.getNorthEast());
        }
        if (center && !this.inRouteOverview) this.map.fitBounds(mapBounds);
    },

    setAdditionalBounds: function(addBounds) {
        this.additionalBounds = addBounds;
    },

    clearAdditionalBounds: function() {
        this.additionalBounds = null;
    },

    drawMarkerOnMap: function (lat, lng, center) {
        var loc = new L.LatLng(lat, lng);
        this.marker.setLatLng(loc);
        if (center && !this.inRouteOverview) {
            this.map.setView(loc, this.getZoom());
            this.doneRouteOverview = false;
        } else {

            if (!this.doneRouteOverview) {

                this.doneRouteOverview = true;

                // don't forget to account for rotation size padding.

                var mapSize = this.map.getSize();
                var mapHPadding = (mapSize.x - $(window).width()) / 2;
                var mapVPadding = (mapSize.y - $(window).height()) / 2;

                mapHPadding = 0;
                mapVPadding = 0;

                var mapBounds = null;
                if (this.polylines !== null) {
                    mapBounds = this.polylines.overlay.getBounds()
                }

                if (this.additionalBounds !== null) {
                    if (mapBounds === null) {
                        mapBounds = this.additionalBounds;
                    } else {
                        mapBounds.extend(this.additionalBounds.getSouthWest());
                        mapBounds.extend(this.additionalBounds.getNorthEast());
                    }
                }

                if (mapBounds !== null) this.map.fitBounds(mapBounds, {padding: [mapHPadding, mapVPadding]});
            }

        }
    },

    removeHelpLine: function () {
        this.helpLine && this.map.removeLayer(this.helpLine);
    },

    drawHelpLine: function (rawPos, desiredPos) {
        var latlngs = [
            new L.LatLng(rawPos.lat, rawPos.lng),
            new L.LatLng(desiredPos.lat, desiredPos.lng)
        ];

        if (!this.helpLine) {
            this.helpLine = new L.Polyline(latlngs, {color: 'darkmagenta', opacity: 0.5, weight: 2});
            this.map.addLayer(this.helpLine);
        } else {
            this.helpLine.setLatLngs(latlngs);
            this.map.addLayer(this.helpLine);
        }
    },

    changeUserZoom: function (value) {
        this.userZoom += value;
    },

    getZoom: function () {
        return this.zoomLevel + this.userZoom;
    },

    setZoom: function (zoom) {
        this.zoomLevel = zoom;
        return this.zoomLevel;
    },

    setMapContainerSize: function (width, height, top, left, rotate) {
        this.el && (this.el[0].style.transform = 'rotate(' + rotate + 'deg');
        this.el.css({
            width: width + 'px',
            height: height + 'px',
            top: top,
            left: left
        });
        if (this.map) this.map._onResize();
    },

    toggleRouteOverview: function () {
        this.inRouteOverview = !this.inRouteOverview;

        if (this.inRouteOverview) {
            this.setMapContainerSize($(window).width(), $(window).height(), 0, 0, 0);
        }
        return this.inRouteOverview;
    }

}, {
    defineLeafletExtensions: function () {

        // see https://github.com/CloudMade/Leaflet/issues/386
        L.Compass = L.Marker
            .extend({

                setIconAngle: function (iconAngle) {
                    this.options.iconAngle = iconAngle;
                    this.update();
                },

                _setPos: function (pos) {
                    L.Marker.prototype._setPos.call(this, pos);

                    var iconAngle = this.options.iconAngle;

                    if (iconAngle) {
                        this._icon.style[L.DomUtil.TRANSFORM] = L.DomUtil.getTranslateString(pos) + ' rotate(' + iconAngle + 'deg)';
                    }
                }
            });

    }
});

module.exports = Leaflet;
