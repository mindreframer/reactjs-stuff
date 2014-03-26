/**
 * @jsx React.DOM
 */

var Label = React.createClass({
    handleClick: function(){
        console.log("Click");
        this.props.children = "Text After Click";
        this.setState({liked: false});
    },

    render: function () {
        console.log("Render");
        return (
            <p ref="p" onClick={this.handleClick}>{this.props.children}</p>
            );
    }
});

