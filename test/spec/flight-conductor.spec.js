'use strict';

function expectException(message, fn) {
  try {
    fn();
  } catch(e) {
    expect(e).toEqual(message);
  }
}

describeComponent('lib/flight-conductor', function () {

  describe('Timeline', function() {
    it('requires a timeline', function () {
      expectException('timeline must be an array of objects', function() {
        setupComponent({timeline: undefined});
      });
    });

    describe('time, start and end properties', function() {
      var errorMessage = 'Each item in the timeline must include either a time property or start and end properties';
      it("each timeline item requires a 'time' property (if 'start' and 'end' aren't provided)", function() {
        expectException(errorMessage, function() {
          setupComponent({timeline: [{foo: 'bar'}]});
        });
      });

      it("each item requires a 'start' and 'end' property (if 'time' isn't provided)", function() {
        expectException(errorMessage, function() {
          setupComponent({timeline: [{start: 123}]});
        });

        expectException(errorMessage, function() {
          setupComponent({timeline: [{end: 123}]});
        });
      });
    });

    describe('#createTimeline', function() {
      beforeEach(setupComponent);

      it('normalises start and end times', function() {
        var timeline = [
          {time: 1, event: 'one'},
          {start: 2, end: 4, event: 'two'},
          {time: 3, event: 'three'}
        ];

        expect(this.component.createTimeline(timeline)).toEqual([
          {time: 1, event: 'one'},
          {time: 2, start: 2, end: 4, event: 'two-start'},
          {time: 3, event: 'three'},
          {time: 4, start: 2, end: 4, event: 'two-end'}
        ]);
      });

      it('sorts out-of-order events correctly', function() {
        var timeline = [
          {time: 3, event: 'three'},
          {start: 2, end: 4, event: 'two'},
          {time: 1, event: 'one'}
        ];

        expect(this.component.createTimeline(timeline)).toEqual([
          {time: 1, event: 'one'},
          {time: 2, start: 2, end: 4, event: 'two-start'},
          {time: 3, event: 'three'},
          {time: 4, start: 2, end: 4, event: 'two-end'}
        ]);
      });
    });
  });



});
