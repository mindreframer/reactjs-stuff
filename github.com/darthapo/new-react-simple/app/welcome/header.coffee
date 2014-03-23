
class Header extends React.Component

  # Static methods become statics on components
  @welcomeMessage: ->
    "Welcome!"

  render: ->
    (@header null,
      (@h1 null, @type.welcomeMessage())
    )


module.exports= Header.toComponent()