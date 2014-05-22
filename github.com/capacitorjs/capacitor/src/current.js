
/**
 * Current
 * @param {String} name name of the event
 * @param {Object|Array|literal} data event data
 */
var Current = function(name, data) {
  this.name = name;
  this.data = data;
};

module.exports = Current;