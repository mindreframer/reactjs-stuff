/** @jsx React.DOM */

var React  = require("react");
var StreamItem = require("./StreamItem");

module.exports = React.createClass({
    getInitialState: function getInitialState() {
        return {
            items: [
                {
                    title: "Severe weather warnings remain along UK coast",
                    body: "Dorset residents on alert as strong winds, high waves and heavy rain threaten areas of England and Wales"
                },
                {
                    title: "UK car production 'to surpass 1970s'",
                    body: "Trade body points to investment, expertise and workforce as reasons why 1.92m record set in 1972 will be broken by 2017"
                }
            ]
        };
    },

    render: function render() {
        var items = this.state.items.map(function(item, i) {
            return <StreamItem key={i} data={item} />;
        });

        return (
            <div className="stream">
                {items}
            </div>
            );
    }
});