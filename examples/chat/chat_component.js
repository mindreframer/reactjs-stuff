var React = require('react');

var ChatComponent = React.createClass({
  displayName: 'ChatComponent',
  getInitialState: function() {
    return {
      messageText: ''
    }
  },
  getDefaultProps: function() {
    return {
      messages: [],
      sendMessage: function() {
        debugger;
      }
    }
  },
  sendMessage: function(event) {
    event.preventDefault();
    if (this.state.messageText) {
      this.props.sendMessage(this.state.messageText);
      this.setState({
        messageText: ''
      });
    }
  },
  handleChange: function(event) {
    event.preventDefault();
    this.setState({
      messageText: event.target.value
    });
  },
  render: function() {
    return (
      React.DOM.div({className: 'chat-component'},
        React.DOM.div({},
          this.props.messages.map(function(message) {
            return React.DOM.div({className: 'media'},
              React.DOM.div({className: 'media-body'}, message.text)
            );
          })
        ),
        React.DOM.form({
            className: 'form',
            onSubmit: this.sendMessage
          },
          React.DOM.input({
              autoFocus: true,
              value: this.state.messageText,
              onChange: this.handleChange,
              className: 'form-field'
          })
        )
      )
    );
  }
});

module.exports = ChatComponent;