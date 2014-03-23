exports.config =
  # See http://brunch.io/#documentation for docs.
  files:
    javascripts:
      joinTo: 'app.js'
    stylesheets:
      joinTo: 'app.css'
    templates:
      joinTo: 'app.js'

  plugins:
    
    react:
      autoIncludeCommentBlock: yes
      harmony: yes
    
    reactTags:
      verbose: yes
