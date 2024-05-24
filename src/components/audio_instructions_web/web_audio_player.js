/**
 * WebAudioPlayer
 * Author: Simon Franzen
 */

/**
 * Constructor
 *
 * Initialize audio player and bind to canplaythrough and
 * timeupdate from audio player
 */

var WebAudioPlayer = function (options) {

    this.options = options || {};

    this.audioData = options.audioData;
	this.audioLanguage = options.audioLanguage.slice(0,2).toLowerCase();

    //check if browser can play audio file
    this.canPlayAudio = ('speechSynthesis' in window);

    this.enabled = false;

};

WebAudioPlayer.prototype.options = null;

WebAudioPlayer.prototype.canPlayAudio = null;

/**
 * Play a string with a street name
 *
 * .
 */
WebAudioPlayer.prototype.play = function (directionCode, nextDirection) {

    if (!this.enabled) return false;

    if (!this.canPlayAudio) return false;

    direction =  this.audioData[directionCode];
    if (typeof direction === 'undefined') {
        console.log('no phrase for ' + directionCode);
        return false;
    }

    if (typeof nextDirection !== 'undefined') {
        direction = direction.replace('{{street}}', nextDirection.street);
    }

	var synthesis = window.speechSynthesis;

	const allVoicesObtained = new Promise(function(resolve, reject) {
		let voices = synthesis.getVoices();
		if (voices.length !== 0) {
			resolve(voices);
		} else {
			const onVoicesChanged = function() {
				synthesis.removeEventListener("voiceschanged", onVoicesChanged);
				voices = synthesis.getVoices();
				resolve(voices);
			};
			synthesis.addEventListener("voiceschanged", onVoicesChanged);
		}
	});

	var self = this;
	allVoicesObtained.then(function(voices) { 
	
		// Get the first `en` language voice in the list
		var voice = voices.filter((voice) => voice.lang.slice(0,2).toLowerCase() == self.audioLanguage )[0];

		// Create an utterance
		var msg = new SpeechSynthesisUtterance(direction);
		
		// Set utterance properties
		msg.voice = voice;
		msg.pitch = 1.5;
		msg.rate = 1.25;
		msg.volume = 0.8;
		
		synthesis.speak(msg);
	});

    return true;
};

WebAudioPlayer.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled;
    return this.enabled;

};


module.exports = WebAudioPlayer;
