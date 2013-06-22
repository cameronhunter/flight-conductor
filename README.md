# flight-conductor

A [Flight](https://github.com/twitter/flight) component for conducting events from an `audio` or `video` element. Inspired by [Mozilla's popcorn.js](http://popcornjs.org).

## Installation

```bash
bower install --save flight-conductor
```
## Example

```javascript
define(['flight-conductor'], function(Conductor) {

  Conductor.attachTo('video', {
    timeline: [
      {time: 1.3, message: 'Hello @flight conductor world!'},
      {time: 2, event: 'conductor-map', location: {lat: 37.7577, lon: -122.4376}},
      {time: 3.5, data: {foo: 'bar!'}},
      {start: 3.5, end: 4, event: 'conductor-footnote', text: 'Events can be one-off or have a start and end.'}
    ]
  });

  // Listen for conductor events (with default event names)
  $('video').on('conductor-event', function(e, data) {
    console.log(e, data);
  });

  // Listen for custom conductor event
  $('video').on('conductor-map', function(e, data) {
    console.log(e, data.location);
  });

  // Listen for start and end events
  $('video').on('conductor-footnote-start', function(e, data) {
    $('.footnote').text(data.text).show();
  });

  $('video').on('conductor-footnote-end', function(e, data) {
    $('.footnote').hide();
  });
});
```

## Development

Development of this component needs [Bower](http://bower.io), and ideally
[Karma](http://karma-runner.github.io) to be globally installed:

```bash
npm install -g bower karma
```

Then install the Node.js and client-side dependencies by running the following
commands in the repo's root directory.

```bash
npm install
bower install
```

To continuously run the tests in Chrome and Firefox during development, just run:

```bash
karma start
```

## Contributing to this project

Anyone and everyone is welcome to contribute. Please take a moment to
review the [guidelines for contributing](CONTRIBUTING.md).

* [Bug reports](CONTRIBUTING.md#bugs)
* [Feature requests](CONTRIBUTING.md#features)
* [Pull requests](CONTRIBUTING.md#pull-requests)
