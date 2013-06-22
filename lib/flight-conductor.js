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

    this.createTimeline = function(timeline, defaultEventName) {
      var ret = [];
      timeline.forEach(function(item) {
        if (item['time'] != null) {
          ret.push(utils.merge({event: (item['event'] || defaultEventName)}, item));
        } else if (item['start'] != null && item['end'] != null) {
          ret.push(utils.merge(item, {time: item['start'], event: item['event'] + '-start'}));
          ret.push(utils.merge(item, {time: item['end'], event: item['event'] + '-end'}));
        } else {
          throw 'Each item in the timeline must include either a time property or start and end properties';
        }
      });
      return ret.sort(timeComparator);
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
      if (!$.isArray(this.attr.timeline)) {
        throw 'timeline must be an array of objects';
      }

      this.originalTimeline = this.createTimeline(this.attr.timeline, this.attr.defaultEventName);

      this.on('play seeked', this.started);
      this.on('timeupdate', this.timeupdate);
    });
  }

});
