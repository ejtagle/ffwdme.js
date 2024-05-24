function init() {

	window.screen.orientation.onchange = function() {
		var el = document.documentElement;
		var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen ;
		var efs = document.exitFullscreen || document.webkitExitFullscreen || document.mozExitFullscreen ;
		if (this.type.startsWith('landscape')) {
			if (!document.fullscreenElement)
				rfs.call(el);
		} else {
			if (document.fullscreenElement)
				efs.call(document);
		}
	};

    ffwdme.on('geoposition:init', function () {
        console.info("Waiting for initial geoposition...");
    });

    ffwdme.on('geoposition:ready', function () {
        console.info("Received initial geoposition!");
        $('#loader').remove();
    });

    // setup ffwdme
    ffwdme.initialize({
        routing: 'GraphHopper',
		geocoding: 'GraphHopper',
        graphHopper: {
            apiKey: CREDENTIALS.graphHopper
        }
    });

	var tileURL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
    var map = new ffwdme.components.Leaflet({el: $('#map'), tileURL: tileURL, center: {lat: 49.90179, lng: 8.85723}});

    var audioData = {
		"en": {
			"INIT": "Audio On",
			"C": "Continue on this road",
			"TL_now": "turn left now on to {{street}}",
			"TL_100": "in 100m turn left on to {{street}}",
			"TL_500": "in 500m turn left",
			"TL_1000": "in 1 kilometer turn left",
			"TSLL_now": "turn slight left now on to {{street}}",
			"TSLL_100": "in 100m turn slight left on to {{street}}",
			"TSLL_500": "in 500m turn slight left",
			"TSLL_1000": "in 1 kilometer turn slight left",
			"TSHL_now": "turn hard left now on to {{street}}",
			"TSHL_100": "in 100m turn hard left on to {{street}}",
			"TSHL_500": "in 500m turn hard left",
			"TSHL_1000": "in 1 kilometer turn hard left",
			"TR_now": "turn right now on to {{street}}",
			"TR_100": "in 100m turn right on to {{street}}",
			"TR_500": "in 500m turn right",
			"TR_1000": "in 1 kilometer turn right",
			"TSLR_now": "turn slight right now on to {{street}}",
			"TSLR_100": "in 100m turn slight right on to {{street}}",
			"TSLR_500": "in 500m turn slight right",
			"TSLR_1000": "in 1 kilometer turn slight right",
			"TSHR_now": "turn hard right on to {{street}}",
			"TSHR_100": "in 100m turn hard right on to {{street}}",
			"TSHR_500": "in 500m turn hard right",
			"TSHR_1000": "in 1 kilometer turn hard right",
			"TU": "Perform a u-turn if possible",
			"C_100": "Continue for 100m on to {{street}}",
			"C_500": "Continue for 500m",
			"C_1000": "Continue for 1 kilometer",
			"C_LONG": "Continue on this road",
			"FINISH": "You have arrived at your destination",
			"EXIT1": "Take the first exit on to {{street}}",
			"EXIT2": "Take the second exit on to {{street}}",
			"EXIT3": "Take the third exit on to {{street}}",
			"EXIT4": "Take the fourth exit on to {{street}}",
			"EXIT5": "Take the fifth exit on to {{street}}"
		},
		"es": {
			"INIT": "Audio habilitado",
			"C": "Continúe en este camino",
			"TL_now": "Ahora doble a la izquierda hacia {{street}}",
			"TL_100": "En 100 metros, doble a la izquierda hacia {{street}}",
			"TL_500": "En 500 metros, doble a la izquierda",
			"TL_1000": "En 1 kilómetro, doble a la izquierda",
			"TSLL_now": "Ahora doble ligeramente a la izquierda hacia {{street}}",
			"TSLL_100": "En 100 metros, doble ligeramente a la izquierda hacia {{street}}",
			"TSLL_500": "En 500 metros, doble ligeramente a la izquierda",
			"TSLL_1000": "En 1 kilómetro, doble ligeramente a la izquierda",
			"TSHL_now": "Ahora doble totalmente a la izquierda hacia {{street}}",
			"TSHL_100": "En 100 metros, doble totalmente a la izquierda hacia {{street}}",
			"TSHL_500": "En 500 metros, doble totalmente a la izquierda",
			"TSHL_1000": "En 1 kilómetro, doble totalmente a la izquierda",
			"TR_now": "Ahora doble a la derecha hacia {{street}}",
			"TR_100": "En 100 metros, doble a la derecha hacia {{street}}",
			"TR_500": "En 500 metros, doble a la derecha",
			"TR_1000": "En 1 kilómetro, doble a la derecha",
			"TSLR_now": "Ahora doble ligeramente a la derecha hacia {{street}}",
			"TSLR_100": "En 100 metros, doble ligeramente a la derecha hacia {{street}}",
			"TSLR_500": "En 500 metros, doble ligeramente a la derecha",
			"TSLR_1000": "En 1 kilómetro, doble ligeramente a la derecha",
			"TSHR_now": "Ahora doble totalmente a la derecha hacia {{street}}",
			"TSHR_100": "En 100 metros, doble totalmente a la derecha hacia {{street}}",
			"TSHR_500": "En 500 metros, doble totalmente a la derecha",
			"TSHR_1000": "En 1 kilómetro, doble totalmente a la derecha",
			"TU": "Realice una vuelta en U, si es posible",
			"C_100": "Continúe por 100 metros hasta llegar a {{street}}",
			"C_500": "Continúe por 500 metros",
			"C_1000": "Continúe por 1 kilómetro",
			"C_LONG": "Continúe por este camino",
			"FINISH": "Ha llegado a su destino",
			"EXIT1": "Tome la primer salida hacia {{street}}",
			"EXIT2": "Tome la segunda salida hacia {{street}}",
			"EXIT3": "Tome la tercera salida hacia {{street}}",
			"EXIT4": "Tome la cuarta salida hacia {{street}}",
			"EXIT5": "Tome la quinta salida hacia {{street}}"
		}
    };

	// Select audio language, based on browser preferences
	var navigatorLanguage = navigator.language.slice(0,2).toLowerCase();
	if (!audioData.hasOwnProperty(navigatorLanguage))
		navigatorLanguage = "en";
	
    window.widgets = {
        map: map,
        autozoom: new ffwdme.components.AutoZoom({map: map}),
        reroute: new ffwdme.components.AutoReroute({parent: '#playground'}),

        zoom: new ffwdme.components.Zoom({map: map, parent: '#playground', grid: {x: 0, y: 0, w: 4, h: 3}}), //--
        distance: new ffwdme.components.DistanceToNextTurn({parent: '#playground', grid: {x: 5, y: 0, w: 11, h: 3}}), //--
        overview: new ffwdme.components.RouteOverview({map: map, parent: '#playground', grid: {x: 16, y: 0, w: 3, h: 3}}), //--
        audio: new ffwdme.components.AudioInstructionsWeb({parent: '#playground', grid: {x: 19, y: 0, w: 3, h: 3},audioData: audioData[navigatorLanguage], audioLanguage: navigatorLanguage }), //
        daynight: new ffwdme.components.DayNight({parent: '#playground', grid: {x: 22, y: 0, w: 3, h: 3}}), //--

		arrow: new ffwdme.components.Arrow({parent: '#playground', grid: {x: 0, y: 22, w: 6, h: 3}}),
        nextTurn: new ffwdme.components.NextStreet({parent: '#playground', grid: {x: 7, y: 22, w: 18, h: 1}}),

        //speed     : new ffwdme.components.Speed({ parent: '#playground', grid: { x: 2, y: 24, w:2, h: 2 } }),
        destTime: new ffwdme.components.TimeToDestination({parent: '#playground', grid: {x: 7, y: 23, w:6, h: 2}}),
        destDist: new ffwdme.components.DistanceToDestination({parent: '#playground', grid: {x: 13, y: 23, w: 6, h: 2}}),
        arrival: new ffwdme.components.ArrivalTime({parent: '#playground', grid: {x: 19, y: 23, w:6, h: 2}, defaultUnit: ''}),
        

        // experimental components
        mapRotator: new ffwdme.components.MapRotator({map: map}),

        // debugging
        //geoloc  : new ffwdme.debug.components.Geolocation({ parent: '#playground', grid: { x: 10, y: 2, w:2, h: 2 }}),
        navInfo: new ffwdme.debug.components.NavInfo(),
        routing: new ffwdme.debug.components.Routing()
    };

    if ((/debug=/).test(window.location.href)) {
        $('#views-toggle').click(function () {
            $('#playground').toggleClass('hidden');
        });
        $('#views-toggle, #nav-info-trigger, #routing-trigger').removeClass('hidden');
    }
}
