var assert = require('chai').assert,
    sinon = require('sinon'),
    Promise = require('bluebird'),
    Capacitor = require('../'),
    CapacitorApiError = require('../src/capacitor_api_error');

describe('Capacitor instanceof EventEmitter', function() {
  var flux;

  beforeEach(function() {
    flux = new Capacitor();
  });

  it('should have on()', function() {
    assert.doesNotThrow(function() {
      flux.on('event', function(){})
    });
  });

  it('should have removeListener()', function() {
    assert.doesNotThrow(function() {
      flux.removeListener('event', function(){})
    });
  });
});