var assert = require('chai').assert,
    sinon = require('sinon'),
    through = require('through2'),
    Capacitor = require('../'),
    Current = require('../src/current'),
    CapacitorApiError = require('../src/capacitor_api_error');

describe('Capacitor#generate() circuit processor', function() {
  var flux, logger, logCapacitor, uppercaser, upCaseCapacitor;

  beforeEach(function() {
    flux = new Capacitor();
    flux.on(Capacitor.events.ERROR, function(err) {
      console.log(err.stack || err);
    });
    flux.on(Capacitor.events.INVALID_RUN, console.log.bind(console));
    flux.on(Capacitor.events.UNDEFINED_CIRCUIT, console.log.bind(console));
    
    logger = sinon.spy();
    logCapacitor = function() {
      return through.obj(function(current, enc, callback) {
        logger(current.name);
        logger(current.data);
        this.push(current);
        return callback();
      });
    };
    flux.circuit('log', function() {
      return this.pipe(logCapacitor());
    });

    uppercaser = sinon.spy(function(str) { return str.toUpperCase(); });
    upCaseCapacitor = function() {
      return through.obj(function(current, enc, callback) {
        current.data = uppercaser(current.data);
        this.push(current);
        return callback();
      });
    }
    flux.circuit('upcase', function() {
      return this.pipe(upCaseCapacitor());
    })

    flux.circuit('logUpCase', function() {
      return this.pipe(logCapacitor()).pipe(upCaseCapacitor());
    });

    flux.circuit('logUpCaseSeparate', function() {
      return this.pipe(logCapacitor());
    }, function() {
      return this.pipe(upCaseCapacitor());
    });
  });

  it('should process a single handler circuit with side effects', function() {
    flux.generate('log', 'message');
    assert.ok(logger.calledTwice, 'should call log()');
    assert.equal(logger.args[0][0], 'log');
    assert.equal(logger.args[1][0], 'message');
  });

  it('should process a single handler circuit that transforms the current', function(done) {
    var msg = 'should be uppercase';
    flux.generate('upcase', msg);
    assert.ok(uppercaser.calledOnce, 'should call uppercaser()');
    assert.equal(uppercaser.args[0][0], msg);
    flux.on(Capacitor.events.DID_GENERATE, function(current) {
      assert.equal(current.data, msg.toUpperCase());
      done();
    });
  });

  it('should process a single handler circuit that has two pipes', function(done) {
    var msg = 'message';
    flux.generate('logUpCase', msg);
    flux.on(Capacitor.events.DID_GENERATE, function(current) {
      assert.equal(current.data, msg.toUpperCase());
      assert.ok(logger.calledTwice, 'should call log()');
      assert.ok(uppercaser.calledOnce, 'should call uppercaser once()');
      assert.equal(logger.args[0][0], 'logUpCase');
      assert.equal(logger.args[1][0], msg);
      assert.equal(uppercaser.args[0][0], msg);
      done();
    });
  });

  it('should process a double handler circuit each with one pipe', function(done) {
    var msg = 'message';
    flux.generate('logUpCaseSeparate', msg);
    flux.on(Capacitor.events.DID_GENERATE, function(current) {
      assert.equal(current.data, msg.toUpperCase());
      assert.ok(logger.calledTwice, 'should call log()');
      assert.ok(uppercaser.calledOnce, 'should call uppercaser once()');
      assert.equal(logger.args[0][0], 'logUpCaseSeparate');
      assert.equal(logger.args[1][0], msg);
      assert.equal(uppercaser.args[0][0], msg);
      done();
    });
  });
});