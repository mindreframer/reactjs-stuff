/**
 * @jsx React.DOM
 */

var React = require('react');
var ReactAsync = require('react-async');
var superagent  = require('superagent');

var Link = require('react-router-component').Link;
var PhoneDetails = require('./PhoneDetails');

var PhonePage = React.createClass({
  mixins: [ReactAsync.Mixin],

  getPhoneInfo: function(phoneName, cb) {
    superagent.get(
      'http://localhost:3000/api/phones/' + phoneName,
      function(err, res) {
        cb(err, res ? {phone: res.body} : null);
      });
  },

  getInitialStateAsync: function(cb) {
    this.getPhoneInfo(this.props.phone, cb);
  },

  componentWillReceiveProps: function(nextProps) {
    if (this.props.phone !== nextProps.phone) {
      this.getPhoneInfo(nextProps.phone, function(err, info) {
        if (err) {
          throw err;
        }
        this.setState(info);
      }.bind(this));
    }
  },

  render: function() {
    return (
      <div className="PhonePage">
        <Link className="backlink" href="/">back to all phones</Link>
        <PhoneDetails phone={this.state.phone} />
      </div>
    );
  }
});

module.exports = PhonePage