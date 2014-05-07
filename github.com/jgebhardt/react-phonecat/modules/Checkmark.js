/**
 * @jsx React.DOM
 */

var React = require('react');

var Checkmark = React.createClass({

  getDefaultProps: function() {
    return {
      checked: false
    };
  },

  render: function() {
    return <span>{this.props.checked ? '\u2713' : '\u2718'}</span>;
  }
});

module.exports = Checkmark;