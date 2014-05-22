var assert = require('chai').assert,
    sinon = require('sinon'),
    Promise = require('bluebird'),
    through = require('through2'),
    Capacitor = require('../'),
    CapacitorApiError = require('../src/capacitor_api_error');

describe('Capacitor#generate() event emitter', function() {
  var flux;

  beforeEach(function() {
    flux = new Capacitor();
    flux.circuit('testEvent', function() {
      return this;
    });
  });

  it('should emit a WARN event on invalid params', function() {
    var emits, handler;
    emits = [
      [],
      [null],
      [null,null],
      [1],
      ['']
    ];
    handler = sinon.spy();
    
    flux.on(Capacitor.events.WARN, handler);
    emits.forEach(function(emit, index) {
      flux.generate.apply(flux, emit);
      assert.ok(handler.called, 'WARN called');
      assert.equal(handler.callCount, index+1, 'WARN called expected number of times');
    });
  });

  it('should emit a WARN event when no handler defined', function() {
    var invalidHandler = sinon.spy(),
        eventName = 'notAValidCircuit';

    flux.on(Capacitor.events.WARN, invalidHandler);
    flux.generate(eventName, {});
    assert.ok(invalidHandler.called, 'WARN called');
    assert.equal(invalidHandler.callCount, 1, 'WARN called expected number of times');
  });

  it('should emit a WILL_GENERATE event before processing an event', function() {
    var capacitorHandler = sinon.spy(),
        willGenerateHandler = sinon.spy(),
        event = {};

    flux.circuit('testEvent', function() {
      return this.pipe(through.obj(function(current, enc, callback) {
        capacitorHandler(current);
        this.push(current);
        callback();
      }));
    });
    flux.on(Capacitor.events.WILL_GENERATE, willGenerateHandler);

    flux.generate('testEvent', event);
    assert.ok(willGenerateHandler.called);
    assert.ok(capacitorHandler.called);
    assert.ok(willGenerateHandler.calledBefore(capacitorHandler));
  });

  it('should emit a DID_GENERATE event after processing an event', function(done) {
    var capacitorHandler = sinon.spy(),
        didGenerateHandler = sinon.spy(),
        event = {};

    flux.circuit('testEvent', function() {
      return this.pipe(through.obj(function(current, enc, callback) {
        capacitorHandler(current);
        this.push(current);
        callback();
      }));
    });
    flux.on(Capacitor.events.DID_GENERATE, didGenerateHandler);

    flux.generate('testEvent', event);
    process.nextTick(function() {
      assert.ok(capacitorHandler.called, 'should call capacitor');
      assert.ok(didGenerateHandler.called, 'should call DID_GENERATE');
      assert.ok(capacitorHandler.calledBefore(didGenerateHandler), 'should call capacitor before DID_GENERATE');
      done();
    })
  });
});