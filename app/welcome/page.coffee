Header= require './header'
Footer= require './footer'

Test= require '../test'

class WelcomePage extends React.Component

  render: ->
    (@article className:'welcome-page',
      (Header null)
      (@section className:'body',
        (Test null)
      )
      (Footer null)
    )


module.exports= WelcomePage.toComponent()