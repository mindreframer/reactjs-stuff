This is an attempt to make Facebook's react library more usable from
CoffeeScript without escaping into JSX or painfully contorting syntax. Here's
what I have so far.

```coffee
class Welcome extends Component
  render: ->
    @div ->
      @text "Hello"
      @span @props.name

component = new Welcome(name: "World")
element = component.buildElement()
```
