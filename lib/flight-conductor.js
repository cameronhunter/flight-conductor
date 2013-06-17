define(function (require) {

  'use strict';

  /**
   * Module dependencies
   */

  var defineComponent = require('flight/lib/component');

  /**
   * Module exports
   */

  return defineComponent(flightConductor);

  /**
   * Module function
   */

  function flightConductor() {
    this.defaultAttrs({

    });

    this.after('initialize', function () {

    });
  }

});
