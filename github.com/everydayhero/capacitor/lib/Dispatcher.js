var Promise = require('es6-promise').Promise;
var _       = require('lodash');

var Dispatcher = function() {
  this._promises = [];
  this._callbacks = [];
  this._actions = {};
};

Dispatcher.prototype = {
  _clearPromises: function() {
    this._promises = [];
  },
  _addPromise: function(callback, payload) {
    this._promises.push(new Promise(function(resolve, reject) {
      if (callback(payload)) {
        resolve(payload);
      } else {
        reject(new Error('Dispatcher callback unsuccessful'));
      }
    }));
  },
  onAction: function(actionType, callback) {
    this._actions[actionType] = this._actions[actionType] || [];
    this._actions[actionType].push(callback);
  },
  triggerAction: function(actionType, data) {
    var dispatcher = this;
    _.each(this._actions[actionType], function(callback) {
      dispatcher._addPromise(callback, data);
    });

    Promise.all(this._promises).then(this._clearPromises);
  },
  register: function(callback) {
    this._callbacks.push(callback);
    return this._callbacks.length - 1;
  },
  dispatch: function(payload) {
    var dispatcher = this;
    _.each(this._callbacks, function(callback) {
      dispatcher._addPromise(callback, payload);
    });
  }
};

module.exports = Dispatcher;
