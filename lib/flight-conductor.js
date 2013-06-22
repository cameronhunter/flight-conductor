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

    var timeComparator = function(a, b) {
      return (a.time <= b.time) ? -1 : 1;
    };

    var eventsAfter = function(time) {
      return function(item) {
        return item.time >= time;
      };
    };

    var createTimeline = function(timeline, defaultEventName) {
      return timeline.map(function(item) {
        if (item.time == null) throw 'Each item in the timeline must have a "time" property';
        return utils.merge({event: (item['event'] || defaultEventName)}, item);
      }).sort(timeComparator);
    };

    this.timeupdate = function(e) {
      var time = e.currentTarget.currentTime;
      while (this.timeline.length && time >= this.timeline[0].time) {
        var timepoint = this.timeline.shift();
        this.trigger(timepoint.event, timepoint);
      }
    };

    this.started = function(e) {
      var time = e.currentTarget.currentTime;
      this.timeline = this.originalTimeline.filter(eventsAfter(time));
    }

    this.after('initialize', function () {
      if (!this.$node.is('audio, video')) {
        throw 'Must be attached to an audio or video element';
      }

      this.originalTimeline = createTimeline(this.attr.timeline, this.attr.defaultEventName);

      this.on('play seeked', this.started);
      this.on('timeupdate', this.timeupdate);
    });
  }

});
