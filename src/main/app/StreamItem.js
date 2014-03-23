/** @jsx React.DOM */

var React  = require("react");

module.exports = React.createClass({
    render: function render() {
        return (
            <div className="streamItem">
                <h2 className="streamItemTitle">
                    {this.props.data.title}
                </h2>
                <p className="streamItemBody">
                    {this.props.data.body}
                </p>
            </div>
            );
    }
});