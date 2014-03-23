
// This will work with ES6 classes as well!
class Test extends React.Component {

  static message() {
    return "Hello, mate."
  }

  getInitialState() {
    return {
      hello: 'Howdy'
    }
  }

  render() {
    return (
      <div>
        You said: { this.type.message() }<br/>
        I said: { this.state.hello }
      </div>
    )
  }

}

module.exports= Test.toComponent()
