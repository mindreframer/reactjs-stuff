require 'coffee-cache'
{jsdom} = require 'jsdom'
browser = jsdom()
global.window = browser.parentWindow
global.document = window.document


beforeEach ->
  @addMatchers
    toMatchMarkup: (expected) ->
      notText = if @isNot then " not" else ""
      @message = -> """
        Expected markup to#{notText} match.
        Actual: #{actualMarkup}
        Expected: #{expectedMarkup}
      """

      actual = @actual.cloneNode(true)
      removeReactDataAttribute(actual)
      actualMarkup = actual.outerHTML
      expectedMarkup = expected.replace(/\n\s*/g, '')

      actualMarkup is expectedMarkup

removeReactDataAttribute = (element) ->
  removeReactDataAttribute(child) for child in element.children
  element.removeAttribute('data-reactid')
