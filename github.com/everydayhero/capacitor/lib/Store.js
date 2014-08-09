var merge        = require('react/lib/merge');
var EventEmitter = require('events').EventEmitter;
var _            = require('lodash');

var ObjectStore = function(data) {
  this._defaults = data || {};
  this.reset();
};

ObjectStore.prototype = merge(EventEmitter.prototype, {
  get: function(key) {
    return this._store[key];
  },

  getAll: function() {
    return this._store;
  },

  set: function(key, value) {
    this._store[key] = value;
  },

  setAll: function(data) {
    this._store = data;
  },

  forEach: function(callback) {
    return _.forEach(this._store, callback);
  },

  reset: function() {
    this._store = merge({}, this._defaults);
  }
});

module.exports = ObjectStore;
