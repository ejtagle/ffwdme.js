var Base = require('./base');
var Arrow = require('./arrow');
var ArrivalTime = require('./arrival_time');
var AudioInstructions = require('./audio_instructions');
var AudioInstructionsWeb = require('./audio_instructions_web');
var AutoReroute = require('./auto_reroute');
var AutoZoom = require('./auto_zoom');
var AutoZoomNextTurn = require('./auto_zoom_next_turn');
var DistanceToDestination = require('./distance_to_destination');
var DistanceToNextTurn = require('./distance_to_next_turn');
var Leaflet = require('./leaflet');
var MapRotator = require('./map_rotator');
var MapRotatorCompass = require('./map_rotator_compass');
var NextStreet = require('./next_street');
var RouteOverview = require('./route_overview');
var Speed = require('./speed');
var Zoom = require('./zoom');
var TimeToDestination = require('./time_to_destination');
var NavStart = require('./nav_start');
var DayNight = require('./daynight');

(function(ffwdme){
  ffwdme.components = {
    Base: Base,
    ArrivalTime: ArrivalTime,
    Arrow: Arrow,
    AudioInstructions: AudioInstructions,
    AudioInstructionsWeb: AudioInstructionsWeb,
    AutoReroute: AutoReroute,
    AutoZoom: AutoZoom,
    AutoZoomNextTurn: AutoZoomNextTurn,
    DistanceToDestination: DistanceToDestination,
    DistanceToNextTurn: DistanceToNextTurn,
    Leaflet: Leaflet,
    MapRotator: MapRotator,
    MapRotatorCompass: MapRotatorCompass,
    NextStreet: NextStreet,
    RouteOverview: RouteOverview,
    Speed: Speed,
    TimeToDestination: TimeToDestination,
    Zoom: Zoom,
    NavStart: NavStart,
	DayNight: DayNight,
  };
})(ffwdme);
