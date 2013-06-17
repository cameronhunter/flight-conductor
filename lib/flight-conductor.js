define(function (require) {

  'use strict';

  /**
   * Module dependencies
   */

  var defineComponent = require('flight/lib/component');
  var utils = require('flight/lib/utils');

  /**
   * Module exports
   */

  return defineComponent(flightConductor);

  /**
   * Module function
   */
  function flightConductor() {

    this.defaultAttrs({
      timeline: [],
      defaultEventName: 'conductor-event'
    });

    var sortByTime = function(a, b) {
      if (a.time === b.time) {
        return 0;
      } else if (a.time <= b.time) {
        return -1;
      } else {
        return 1;
      }
    };

    var copy = function(array) {
      return array.slice(0);
    };

    var createTimeline = function(timeline, defaultEventName) {
      return timeline.map(function(item) {
        var event = item['event'] || defaultEventName;
        return utils.merge({event: event}, item);
      }).sort(sortByTime);
    };

    this.timeupdate = function(e) {
      var time = e.currentTarget.currentTime;
      while (this.timeline.length && time >= this.timeline[0].time) {
        var timepoint = this.timeline.shift();
        this.trigger(timepoint.event, timepoint);
      }
    };

    this.reset = function(e) {
      this.timeline = copy(this.originalTimeline);
    };

    this.after('initialize', function () {
      if (!this.$node.is('audio, video')) {
        throw 'Must be attached to an audio or video element';
      }

      this.originalTimeline = createTimeline(this.attr.timeline, this.attr.defaultEventName);
      this.timeline = copy(this.originalTimeline);

      this.on('timeupdate', this.timeupdate);
      this.on('ended', this.reset);
    });
  }

});
