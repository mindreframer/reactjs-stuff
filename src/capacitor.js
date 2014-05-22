var Promise = require('bluebird'),
    util = require('util'),
    EventEmitter = require('events').EventEmitter,
    Current = require('./current'),
    terminal = require('./terminal'),
    capacitorStream = require('./capacitor_stream'),
    CapacitorApiError = require('./capacitor_api_error');

/**
 * Capacitor
 */
var Capacitor = function() {
  EventEmitter.call(this);

  /**
   * a mapping of name -> circuit
   * @type {Object}
   */
  this._circuits = {};

  /**
   * a function of the form
   * fn(name, circuits) => [handler]
   * where
   * @param {String} name the name of a circuit
   * @param {Object} circuits the _circuits mapping of name -> circuit
   * @type {Array} returns an array of functions
   */
  this._demuxer = {
    initialize: function() {},
    resolve: function capacitor_default_demuxer(name, circuits) {
      return circuits[name];
    }
  };

  /**
   * a writable stream that all circuits pipe to,
   * used to keep track of when Currents are done
   * processing.
   * @type {[type]}
   */
  this._terminal = terminal(this, Capacitor.events.DID_GENERATE);
};

/**
 * Capacitor.events
 * catalog of events that may be emitted by a Capacitor instance.
 * @type {Object}
 */
Capacitor.events = {
  /**
   * Emitted when generate() processing encounters an error at any stage.
   * You should consider your application to be in an **instable state**
   * and close/reinitialize as soon as possible.
   *
   * Example: 
   * ```javascript
   * flux.on(Capacitor.events.ERROR, function(err) {
   *    try {
   *      // try to show an error modal
   *      $('.error-modal').modal('show');
   *      // log the error somewhere
   *      logErrorToAnalytics(err);
   *    } catch (e) {
   *      // error reporting the error - nothing we can do
   *    }
   *
   *    // finally restart the app
   *    window.location.href = '/';
   * });
   * ```
   * @type {String}
   */
  ERROR: 'Capacitor.ERROR',

  /**
   * Emitted when generate() cannot run because the 
   * input is invalid or no handler is defined.
   * Intended for use in development for debugging
   * @type {String}
   */
  WARN: 'Capacitor.WARN',

  /**
   * Emitted when generate() is called; eg whenever
   * an event is submitted to the system but before it is
   * processed at all.
   * @type {String}
   */
  WILL_GENERATE: 'Capacitor.WILL_GENERATE',

  /**
   * Emitted after generate() has completely finished
   * processing an event.
   * @type {String}
   */
  DID_GENERATE: 'Capacitor.DID_GENERATE'
};

// Capacitor instanceof EventEmitter
util.inherits(Capacitor, EventEmitter);

/**
 * Constructor
 */
Capacitor.prototype.constructor = Capacitor;

/**
 * circuit()
 * @param  {String} name
 * @param {String|Function} ...varargs
 * @return {Stream} a stream that `Current`s can be written to
 *
 * Defines a processing pipeline for events aka currents that match the given name.
 */
Capacitor.prototype.circuit = function(name) {
  var stream, handlers, stream;
  handlers = Array.prototype.slice.call(arguments, 0).filter(function(handler) {
    return typeof handler === 'function';
  });
  if (!handlers.length) {
    throw new CapacitorApiError('Capacitor#circuit() requires a non-empty name and at least one function argument.');
  }
  // create new stream using the defined values
  stream = capacitorStream(handlers, this._terminal);
  if (typeof name === 'string' && name) {
    this._circuits[name] = stream;
  }
  return stream;
};

/**
 * demuxer()
 * @param  {CapacitorDemuxer} demuxer: an object with
 * - `#initialize(capacitor)` - function to initialize the demuxer for this Capacitor instance
 * - `#resolve(name)` - function to resolve an event name to a stream
 * @return {None}      no return value
 *
 * Provides a custom object for resolving generate() events into handlers. The default
 * is a one-to-one mapper where `generate('hello', ...)` is resolved to what you set via
 * `circuit('hello', ...)`.
 */
Capacitor.prototype.demuxer = function(demuxer) {
  if (typeof demuxer.initialize !== 'function' || typeof demuxer.resolve !== 'function') {
    throw new CapacitorApiError('Capacitor#demuxer() requires a initialize() && resolve()');
  }
  demuxer.initialize(this);
  this._demuxer = demuxer;
};

/**
 * generate()
 * @param  {String} eventName name of the event to process
 * @param  {Object|Array|literal} eventData event value. if you have multiple params, wrap them.
 * @return {None}           no return value
 *
 * Creates a `Current` from the event name and data, determines the processing pipeline for that
 * event name, and runs the Current through the pipeline. Emits events during the processing:
 *
 * if no handler defined: 
 * - emit `WARN` and nothing else
 *
 * if a handler is defined:
 * - emit `WILL_GENERATE`
 * - process the current
 * - emit `DID_GENERATE`
 *   
 * If an error occurrs at any point in the above, `ERROR` is emitted.
 */
Capacitor.prototype.generate = function(eventName, eventData) {
  var current, circuit, stream;
  if (typeof eventName !== 'string' || !eventName) {
    this.emit(Capacitor.events.WARN, eventName, eventData, 'Capacitor#generate() requires a string eventName');
    return;
  }
  current = new Current(eventName, eventData);
  circuit = this._demuxer.resolve(eventName, this._circuits);

  if (!circuit) {
    this.emit(Capacitor.events.WARN, eventName, eventData, 'Capacitor#generate() no circuit found for ' + eventName);
    return
  }

  try {
    this.emit(Capacitor.events.WILL_GENERATE, current);
    circuit.write(current);
  } catch (err) {
    this.emit(Capacitor.events.ERROR, err, current);
  }
};

module.exports = Capacitor;
