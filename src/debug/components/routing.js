var Routing = ffwdme.components.Base.extend({

  constructor: function(options) {
    this.base(options);
    this.bindAll(this, 'start', 'error', 'success', 'calculateRouteByForm', 'fetchCombination');

    var self = this;
	
    $('#load-combination').click(function(){ self.fetchCombination(); });
    $('#calc-route-by-form').click(function(){ self.calculateRouteByForm(); });
	$('#custom-route-start-at-current').click(function(){ self.startAtCurrent(); });
	$('#custom-route-dest-at-current').click(function(){ self.destAtCurrent(); });
	$('#custom-route-find-start-addr').click(function(){ self.findStartAddr(); });
	$('#custom-route-find-dest-addr').click(function(){ self.findDestAddr(); });

    $('#player-start').click(function(){ self.player.start(); });
    $('#player-pause').click(function(){ self.player.pause(); });
    $('#player-reset').click(function(){ self.player.reset(); });
	
	$('#routing-trigger').click(function(){
      $('#routing').toggleClass('hidden');
      $('#nav-info').addClass('hidden');
    });

    ffwdme.on('routecalculation:start', this.routeStart);
    ffwdme.on('routecalculation:error', this.routeError);
    ffwdme.on('routecalculation:success', this.routeSuccess);
	
    ffwdme.on('geocoding:error', function(data) { self.geocodingError(data); });
    ffwdme.on('geocoding:success', function(response) { self.geocodingSuccess(response); });
  },

  player: null,
  isDestAddress : false,

  routeStart: function(data) {
    console.info('routing started');
  },

  routeError: function(data) {
    console.error('routing FAILED');
  },

  routeSuccess: function(response) {
    console.info('routing SUCCESSFULL!');
    console.dir(response);
    ffwdme.navigation.setRoute(response.route).start();
  },

  fetchCombination: function() {
    var values = $('#select-combination').val().split(';');
    var trackId = values[0];

    $('#custom-route-start-lat').val(values[1]);
    $('#custom-route-start-lng').val(values[2]);
    $('#custom-route-dest-lat').val(values[3]);
    $('#custom-route-dest-lng').val(values[4]);

    try {
      this.player = new ffwdme.debug.geoprovider.PlayerLocal({
        // dieburg industriegebiet
        //id: '2011-03-18-16-48-12'
        id: trackId
      });
      $('#geoprovider-track').text(trackId);
    } catch(e) {
      $('#geoprovider-track').text('Could not fetch the recorded track!: ' + trackId);
    }
  },

  calculateRouteByForm: function() {
    var slat = document.getElementById('custom-route-start-lat').value;
    var slng = document.getElementById('custom-route-start-lng').value;
    var dlat = document.getElementById('custom-route-dest-lat').value;
    var dlng = document.getElementById('custom-route-dest-lng').value;

    var route = new ffwdme.routingService({
      start: { lat: slat, lng: slng },
      dest:  { lat: dlat, lng: dlng }
    }).fetch();
  },
  
  startAtCurrent: function() {
	if (ffwdme.geolocation.last == null)
	  return;
  
    document.getElementById('custom-route-start-lat').value = ffwdme.geolocation.last.point.lat;
    document.getElementById('custom-route-start-lng').value = ffwdme.geolocation.last.point.lng;
	document.getElementById('custom-route-start-addr').value = "";
  },

  destAtCurrent: function() {
	if (ffwdme.geolocation.last == null)
	  return;
  
    document.getElementById('custom-route-dest-lat').value = ffwdme.geolocation.last.point.lat;
    document.getElementById('custom-route-dest-lng').value = ffwdme.geolocation.last.point.lng;
	document.getElementById('custom-route-dest-addr').value = "";
  },
  
  geocodingError: function(data) {
    console.error('geocoding FAILED');
  },

  geocodingSuccess: function(response) {
    console.info('geocoding SUCCESSFULL!');
    console.dir(response);
	
	if (this.isDestAddress) {
		document.getElementById('custom-route-dest-lat').value = response.point.lat;
		document.getElementById('custom-route-dest-lng').value = response.point.lng;
	} else {
		document.getElementById('custom-route-start-lat').value = response.point.lat;
		document.getElementById('custom-route-start-lng').value = response.point.lng;
	}
  },
  
  findStartAddr: function() {
	this.isDestAddress = false;
	var geocode = new ffwdme.geocodingService({
		address: document.getElementById('custom-route-start-addr').value,
		anchorPoint: ffwdme.geolocation.last != null ? ffwdme.geolocation.last.point : null
	}).fetch();
  },
  
  findDestAddr: function() {
	this.isDestAddress = true;
	var geocode = new ffwdme.geocodingService({
		address: document.getElementById('custom-route-dest-addr').value
	}).fetch();
  }
  
});

module.exports = Routing;
