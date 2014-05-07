/**
 * @jsx React.DOM
 */

var React = require('react');
var ReactMount  = require('react/lib/ReactMount');
var ReactRouter = require('react-router-component');

var Pages = ReactRouter.Pages;
var Page = ReactRouter.Page;
var NotFound = ReactRouter.NotFound;

var NotFoundHandler = require('./NotFoundHandler');
var PhonesPage = require('./PhonesPage');
var PhonePage = require('./PhonePage');

ReactMount.allowFullPageRender = true;

var App = React.createClass({

  render: function() {
    return (
      <html>
        <head>
          <link rel="stylesheet" href="/assets/css/bootstrap.css" />
          <link rel="stylesheet" href="/assets/css/app.css" />
          <link rel="stylesheet" href="/assets/css/animations.css" />
          <script src="/assets/bundle.js" />
        </head>
        <Pages
          className="App"
          path={this.props.path}>
          <Page path="/" handler={PhonesPage} />
          <Page path="/phones" handler={PhonesPage} />
          <Page path="/phones/:phone" handler={PhonePage} />
          <NotFound handler={NotFoundHandler} />
        </Pages>
      </html>
    );
  }
});

if (typeof window !== 'undefined') {
  window.onload = function() {
    React.renderComponent(App(), document);
  }
}

module.exports = App;