/** @jsx React.DOM */

var React  = require("react");
var Stream = require("../../main/app/Stream");
var assert = require("assert");
var cheerio = require('cheerio');

describe("Stream", function() {
    it("should have default 2 items", function() {
        var s = React.renderComponentToString(<Stream />),
            $ = cheerio.load(s);

        assert.equal($('.streamItem').length, 2);
    })
});