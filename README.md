# The Goal

This is HTML5 + ReactJS + CoffeeScript application, built with [Brunch](http://brunch.io).

## Raison d'Etre

I love [React.js][] and I love [CoffeeScript][]. But they aren't the most fun to use in concert. React has JSX, which is very cool (I even built [react-brunch][] so I could use it with [brunch.io][]), but it requires writing straight, *tedious*, javascript. Not ideal (For *me* anyway). 

Really, I want what I perceive to be the best of both worlds, and to treat react components as classes (at least in definition, it gets me some nice editor/ide benefits). 

By combining [react-coffee][] with [react-tags-brunch][] you can write the following example. It's clean and pretty (to my eyes).

```coffeescript
class HeaderBar extends React.Component
  render: ->
    (@header null,
      (@h1 null, "My App")
    )

module.exports= HeaderBar.toComponent()
```


## For The Curious

[react-tags-brunch][] is a build-time plugin for [brunch][]. It scans the source (as a String) and converts calls from `this.TAG` to `React.DOM.TAG`, but only if 'TAG' is actually a dom component defined in `React.DOM`.

The example above, after it's been run through [brunch][], looks like this:

```javascript
var HeaderBar,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

HeaderBar = (function(_super) {
  __extends(HeaderBar, _super);

  function HeaderBar() {
    return HeaderBar.__super__.constructor.apply(this, arguments);
  }

  HeaderBar.prototype.render = function() {
    return React.DOM.header(null, React.DOM.h1(null, "My App"));
  };

  return HeaderBar;

})(React.Component);

module.exports = HeaderBar.toComponent();
```

[react-coffee][] is a runtime micro-lib that will take the CoffeeScript class and convert it to a react component when `toComponent` is called. That's why the result of `HeaderBar.toComponent()` is what's exported from the module. 

# ES6

Interestingly, you can use JSX's `harmony` flag (enabled by default in this project) to generate ES6 classes and use [react-coffee][] with it. Like this:


test.jsx:
```javascript
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
```

[React.js]: facebook.github.io/react/
[CoffeeScript]: http://coffeescript.org/
[brunch.io]: http://brunch.io
[brunch]: http://brunch.io
[react-coffee]: https://github.com/elucidata/react-coffee
[react-tags-brunch]: https://github.com/elucidata/react-tags-brunch
[react-brunch]: https://github.com/darthapo/react-brunch