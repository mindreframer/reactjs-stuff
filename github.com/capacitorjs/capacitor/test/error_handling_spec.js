var assert = require('chai').assert,
    sinon = require('sinon'),
    through = require('through2'),
    Capacitor = require('../'),
    CapacitorApiError = require('../src/capacitor_api_error');

describe('Capacitor#generate() error handling', function() {
  var flux, errorCapacitor;

  beforeEach(function() {
    flux = new Capacitor();
    flux.on(Capacitor.events.WARN, console.log.bind(console));
    
    errorCapacitor = function() {
      return through.obj(function(current, enc, callback) {
        throw new CapacitorApiError('fail');
      });
    }
    flux.circuit('error', function() {
      return this.pipe(errorCapacitor());
    });
    flux.circuit('ok', function() {
      return this;
    });
  });

  it('should emit an error if a capacitor throws an error', function(done) {
    flux.on(Capacitor.events.ERROR, function(err) {
      assert.instanceOf(err, CapacitorApiError);
      assert.equal(err.message, 'fail');
      done();
    });
    flux.generate('error');
  });

  it('should not drop currents on an ok circuit if error occurs elsewhere', function(done) {
    var didPulseHandler = sinon.spy(),
        errorHandler = sinon.spy();

    flux.on(Capacitor.events.DID_GENERATE, didPulseHandler);
    flux.on(Capacitor.events.ERROR, errorHandler);
    flux.generate('error');
    flux.generate('ok');
    flux.generate('ok');
    flux.generate('ok');

    process.nextTick(function() {
      assert.equal(didPulseHandler.callCount, 3, 'all currents on non-erroring circuits get through');
      assert.equal(errorHandler.callCount, 1, 'only the error current errors');
      done();
    });
  });

  it('should drop events on a circuit once an error occurs', function(done) {
    var didPulseHandler = sinon.spy(),
        errorHandler = sinon.spy();

    flux.on(Capacitor.events.DID_GENERATE, didPulseHandler);
    flux.on(Capacitor.events.ERROR, errorHandler);
    flux.generate('error');
    flux.generate('error');
      
    process.nextTick(function() {
      assert.equal(didPulseHandler.callCount, 0, 'no currents get through');
      assert.equal(errorHandler.callCount, 1, 'error handler called only once for the first error');
      done();
    });
  });
});