var assert = require('chai').assert,
    sinon = require('sinon'),
    Promise = require('bluebird'),
    Capacitor = require('../'),
    CapacitorApiError = require('../src/capacitor_api_error');

describe('Capacitor#circuit()', function() {
  var flux;

  beforeEach(function() {
    flux = new Capacitor();
  });
  
  it('should reject invalid circuits', function() {
    var circuits = [
      ['name'],
      [{}],
      [true],
      [''],
      [1]
    ];
    circuits.forEach(function(circuit) {
      assert.throw(function() {
        flux.circuit.apply(flux, circuit);
      }, CapacitorApiError);
    });
  });

  it('should accept valid circuits', function() {
    assert.doesNotThrow(function() {
      try {
        flux.circuit('event', function() {
          return this;
        });
      } catch (err) {
        console.log(err.stack || err);
        throw err;
      }
    });
  });
});