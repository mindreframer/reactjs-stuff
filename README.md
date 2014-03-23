## react-tags-brunch

Adds [React.js](http://facebook.github.io/react/) tag interpolation to 
[brunch](http://brunch.io).

Scans your javascript and replaces calls to `this.div` to `React.DOM.div` 
(`div` used as an example, will interpolate any tag found in `React.DOM`)

I use this with CoffeeScript to make writing components more joyful.

```coffeescript
MyComponent= React.createClass
  displayName: 'MyComponent'

  render: ->
    (@div null, "Hello")

module.exports= MyComponent
```

Eventual output:

```javascript
var MyComponent;

MyComponent = React.createClass({
  displayName: 'MyComponent',
  render: function() {
    return React.DOM.div(null, "Hello");
  }
});

module.exports = MyComponent;
```

### Optional Configuration

Example `brunch-config.coffee`:

```coffeescript
exports.config =
  plugins:
    reactTags:
      fileFilter: /^(app|test)/
      blacklist: 'object data map var'.split(' ')
      verbose: no

  # Usual brunch config stuf...
  files:
    javascripts:
      joinTo: 'app.js'
    stylesheets:
      joinTo: 'app.css'
    templates:
      joinTo: 'app.js'
```

### Blacklist

There are some dom components that mean something special to javascript (`var`),
require a non-dot-notation syntax to use, or are just too common in typical
component definition (`map`). For these components you'll need to postfix 
the nodename with an underscore (`_`), like this:

```coffeescript
render: ->
  (@object_ null)
```

```javascript
render: function() {
  return React.DOM.object(null)
}
```

### React Coffee

If you use the [elucidata-react-coffee](https://github.com/elucidata/react-coffee)
micro-lib, you can use CoffeeScript classes (and the editor tooling around them) to
define React Components:

```coffeescript
class MyComponent extends React.Component
  render: ->
    (@div null, "Hello")

module.exports= MyComponent.reactify()
```

## Usage

Install the plugin via npm with `npm install --save react-tags-brunch`.

Or, do manual install:

* Add `"react-tags-brunch": "x.y.z"` to `package.json` of your brunch app.
  Pick a plugin version that corresponds to your minor (y) brunch version.
* If you want to use git version of plugin, add
`"react-tags-brunch": "git+ssh://git@github.com:brunch/react-tags-brunch.git"`.

## License

The MIT License (MIT)

Copyright (c) 2014 Matt McCray (http://elucidata.net)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
