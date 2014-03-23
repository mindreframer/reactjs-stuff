/** @jsx React.DOM */

var React  = require("react");
var Stream = require("./Stream");
var Label = require("./Label");

React.renderComponent(<Stream />, document.getElementById("stream"));
React.renderComponent(<Label>Some Text We Need for Test</Label>, document.getElementById("label"));
