var Writable = require('stream').Writable;

/**
 * capacitor_terminal()
 * @param  {capacitor} capacitor     a capacitor instance
 * @param  {String} completeEvent an event name to emit whenever data is received
 * @return {Writable}               a writable stream
 *
 * Creates a new writable stream (eg end of the line)
 * that will emit `completeEvent` whenever it receives a current instance.
 *
 * The terminal 'writes' (eg returns) immediately so current processing is not delayed.
 */
module.exports = function(capacitor, completeEvent) {
  var terminal = Writable({objectMode: true});
  terminal._write = function(current, enc, callback) {
    capacitor.emit(completeEvent, current);
    callback();
  };
  return terminal;
};