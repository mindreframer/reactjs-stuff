var util = require('util');

// from @JayyVis at http://stackoverflow.com/a/8460508/73547

function CapacitorApiError(message) {
  Error.call(this); //super constructor
  Error.captureStackTrace(this, this.constructor); //super helper method to include stack trace in error object

  this.name = this.constructor.name; //set our function’s name as error name.
  this.message = message; //set the error message
}

util.inherits(CapacitorApiError, Error);

module.exports = CapacitorApiError;