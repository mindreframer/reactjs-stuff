var through = require('through'),
    _memo = {};

/**
 * capacitor_stream()
 * @param  {Object} handlers    the available handlers
 * @param  {String} property property name on state
 * @param  {Stream} dest a stream to pipe to
 * @return {Stream}          a node stream
 *
 * If `state[property]` is a stream, return it.
 * Otherwise replace the property with a new stream.
 */
module.exports = function capacitor_stream(handlers, terminal) {
  var stream, pipeline;

  // if we've already converted from a fn -> stream, return it.
  if (handlers._memo === _memo) {
    return handlers;
  }

  // make a new stream that we can later write to
  stream = through();
  pipeline = stream;
  // iteratively call each handler function
  handlers.forEach(function(handler) {
    pipeline = handler.call(pipeline);
  });
  // pipe the output to the terminal
  pipeline.pipe(terminal);
  // add a property so we know it has been converted
  stream._memo = _memo;

  // return the outer stream that currents can be written to
  return stream;
};