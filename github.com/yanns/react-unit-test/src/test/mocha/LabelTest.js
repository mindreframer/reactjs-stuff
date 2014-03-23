/** @jsx React.DOM */

var React  = require("react/addons"),
	ReactTestUtils = React.addons.TestUtils;
var Label = require("../../main/app/Label");
var assert = require("assert");
var jsdom = require('jsdom').jsdom;

global.initDOM = function () {
	console.log("init test dom");
	var jsdom = require('jsdom');
	global.window = jsdom.jsdom().createWindow('<html><body></body></html>');
	global.document = window.document;
    global.navigator = window.navigator;
}

global.cleanDOM = function() {
	console.log("clean test dom");
	delete global.window;
	delete global.document;
	delete global.navigator;
}

describe("Label Test", function() {

	beforeEach(function() {
		initDOM();
	});

	afterEach(function() {
		cleanDOM();
	});

    it("Check Text Assignment", function() {
    	var label = ReactTestUtils.renderIntoDocument(<Label>Some Text We Need for Test</Label>);
    	assert.equal(label.refs.p.props.children, "Some Text We Need for Test");
    });

    it("Click", function () {
    	var label = ReactTestUtils.renderIntoDocument(<Label>Some Text We Need to Test</Label>);

        ReactTestUtils.Simulate.click(label.refs.p);
        assert.equal(label.refs.p.props.children, "Text After Click");
    });
});