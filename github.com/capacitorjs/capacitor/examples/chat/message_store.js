var through = require('through2');

var MessageStore = function() {
  var store = this;
  this.messages = [];

  this.sender = through.obj(function(current, enc, callback) {
    if (!current.data) {
      this.push(current);
      return callback();
    }
    current.data = {
      text: current.data
    };
    store.messages.push(current.data);
    this.push(current);
    return callback();
  });
}

module.exports = MessageStore;