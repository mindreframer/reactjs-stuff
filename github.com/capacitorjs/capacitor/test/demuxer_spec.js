var assert = require('chai').assert,
    sinon = require('sinon'),
    Promise = require('bluebird'),
    through = require('through2'),
    Capacitor = require('../'),
    CapacitorApiError = require('../src/capacitor_api_error');

describe('Capacitor#demuxer()', function() {
  var flux, handler;

  beforeEach(function() {
    handler = sinon.spy();
    flux = new Capacitor();
    flux.circuit('testEvent', function() {
      return this.pipe(through.obj(function(current, enc, callback) {
        handler(current);
        this.push(current);
        callback();
      }));
    });
  });

  it('should demux by default to whatever is defined via #circuit()', function() {
    flux.generate('testEvent', {});
    assert.ok(handler.called, 'generate() is routed to the named circuit by default');
  });

  it('should demux using a custom demuxer', function() {
    var demuxer, evenHandler, oddHandler, count;
    evenHandler = sinon.spy();
    oddHandler = sinon.spy();
    count = 0;
    demuxer = {
      initialize: function(flux) {
        this.flux = flux;
        this.odd = flux.circuit(function() {
          return this.pipe(through.obj(function(current, enc, callback) {
            oddHandler(current);
            this.push(current);
            callback();
          }));
        });
        this.even = flux.circuit(function() {
          return this.pipe(through.obj(function(current, enc, callback) {
            evenHandler(current);
            this.push(current);
            callback();
          }));
        });
      },
      resolve: function(name) {
        return ++count % 2 === 0 ? this.even : this.odd;
      }
    };

    flux.demuxer(demuxer);

    for (var ix = 0; ix < 100; ix++) {
      flux.generate('whatever', ix);
    }

    assert.equal(evenHandler.callCount, ix/2);
    assert.equal(oddHandler.callCount, ix/2);
  });
});