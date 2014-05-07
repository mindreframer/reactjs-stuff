/**
 * @jsx React.DOM
 */

var React = require('react');
var ReactAsync = require('react-async');
var superagent  = require('superagent');
var PhoneList = require('./PhoneList');

var PhonesPage = React.createClass({
  mixins: [ReactAsync.Mixin],

  getPhonesData: function(cb) {
    superagent.get(
      'http://localhost:3000/api/phones/',
      function(err, res) {
        cb(err, res ? {phones: res.body} : null);
      });
  },

  getInitialStateAsync: function(cb) {
    this.getPhonesData(cb);
  },

  render: function() {
    return <PhoneList phones={this.state.phones} />;
  }
});

module.exports = PhonesPage;