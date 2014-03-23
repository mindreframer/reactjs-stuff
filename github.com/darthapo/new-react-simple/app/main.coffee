WelcomePage= require 'welcome/page'

window.onload= ->
  React.renderComponent WelcomePage(), document.body
  console.log "Ready!"
