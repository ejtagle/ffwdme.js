var Base = require('../base');

var Arrow = Base.extend({

    classname: "Arrow",

    constructor: function (options) {
        this.base(options);

        this.turnTypeIconPaths = {
            'C': 'arrow/straight.svg',
            'TL': 'arrow/left.svg',
            'TSLL': 'arrow/half-left.svg',
            'TSHL': 'arrow/hard-left.svg',
            'TR': 'arrow/right.svg',
            'TSLR': 'arrow/half-right.svg',
            'TSHR': 'arrow/hard-right.svg',
            'EXIT1': 'arrow/roundabout.svg',
            'EXIT2': 'arrow/roundabout.svg',
            'EXIT3': 'arrow/roundabout.svg',
            'EXIT4': 'arrow/roundabout.svg',
            'EXIT5': 'arrow/roundabout.svg',
            'EXIT6': 'arrow/roundabout.svg',
            'TU': 'arrow/u-turn.svg',
            'FINISH': 'arrow/flag.svg'
        }; //turn types to icon files

        this.bindAll(this, 'onRoute');
        ffwdme.on('navigation:onroute', this.onRoute);

        this.render();
    },

    classes: 'ffwdme-components-container ffwdme-grid-w3 ffwdme-grid-h2 ffwdme-info',

    turnTypeIconPaths: null,

    arrowEl: null,

    labelEl: null,

    distEl: null,

    lastTurn: null,

    announceDist: 150,

    imgUrl: function () {
        return ffwdme.defaults.imageBaseUrl;
    },

    make: function () {
        this.base();

        //create arrow ele
        var img = document.createElement('img');
        img.src = this.getRetinaImageUrl(this.imgUrl() + this.turnTypeIconPaths.C); //straight as default
        this.arrowEl = $(img).addClass('ffwdme-components-small-arrow').appendTo($(this.el));

        //label for exit
        var label = document.createElement('span');
        this.labelEl = $(label).addClass('ffwdme-components-label').addClass('ffwdme-components-label-roundabout').appendTo($(this.el));

        //label for distance
        var distbar = document.createElement('span');
        this.distEl = $(distbar).addClass('ffwdme-components-progress').appendTo($(this.el));
    },

    onRoute: function (e) {

        console.log(e);

        var turnType = null;
        var distance = e.navInfo.distanceToNextDirection;

        if (e.navInfo.finalDirection === true) {
            turnType = 'FINISH';
        } else {
            var direction = e.navInfo.nextDirection;
            if (!direction) return;


            turnType = direction.turnType;
            if (!turnType) return;

            if (distance > this.announceDist) {
                turnType = 'C';
            }


            if (/^EXIT/.test(turnType)) {
                this.labelEl.html(turnType.split('EXIT')[1]);
            } else {
                this.labelEl.html('');
            }
        }

        if (distance) {
            var width;
            var tooFar = false;
            if (distance > this.announceDist) {
                tooFar = true;
            } else if (distance > 100) {
                width = 100;
            } else {
                width = distance;
            }

            width = Math.floor(width/10) * 10; // 10, 20, 30, 40 ... 90

            if (tooFar) {
                $(this.distEl).addClass('ffwdme-components-progress-numeric').attr('style', 'width: 100%').html(this.niceDistance(distance));
            } else {
                $(this.distEl).removeClass('ffwdme-components-progress-numeric').attr('style', 'width: ' + width + '%').html('');
            }

        }

        this.updateIcon(turnType);
    },

    niceDistance: function(distance, units) {

        var displayUnits = 'km';
        if (units === 'mi') {
            displayDistance = distance / 1600;
            displayUnits = 'mi';
        } else {
            displayDistance = distance / 1000;
        }

        if (displayDistance < 1) {
            displayDistance *= 1000;
            displayDistance = (displayDistance / 50).toFixed(0) * 50;
            displayUnits = (units === 'mi')?'y':'m';
        } else {
            if (displayDistance > 10) {
                displayDistance = displayDistance.toFixed(0);
            } else {
                displayDistance = displayDistance.toFixed(1);
            }
        }


        return displayDistance + displayUnits;

    },

    updateIcon: function (turnType) {
        if (turnType != this.lastTurn) { // set img src only when turn type changes
            this.arrowEl[0].src = this.getRetinaImageUrl(this.imgUrl() + this.turnTypeIconPaths[turnType]);
            this.lastTurn = turnType;
        }
    }

});

module.exports = Arrow;
