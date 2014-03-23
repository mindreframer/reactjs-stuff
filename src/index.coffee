
react_dom= require('react').DOM
tagParser= /this\.([\w|_]*)\(/g
escapedTag= /[\w]*_$/

module.exports = class ReactTagsPlugin
  brunchPlugin: yes
  type: 'javascript'
  pattern: /\.js|\.coffee/

  constructor: (@config) ->
    @filter= @config?.plugins?.reactTags?.fileFilter or /^(app|test)/
    @blacklist= @config?.plugins?.reactTags?.blacklist or 'object data map var'.split(' ')
    @verbose= @config?.plugins?.reactTags?.verbose or no

  compile: (params, callback) ->
    source= params.data

    return callback null, data:source unless @filter.test(params.path)

    try
      blacklist= @blacklist
      taglist= []

      output= source.replace tagParser, (fragment, tag)->

        return fragment if tag in blacklist

        if escapedTag.test(tag)
          shortTag= tag.substring(0, tag.length - 1)

          if shortTag in blacklist
            taglist.push shortTag unless shortTag in taglist
            return "React.DOM.#{ shortTag }("

        if react_dom.hasOwnProperty(tag) #React.DOM[ tag ]?
          taglist.push tag unless tag in taglist
          return "React.DOM.#{ tag }("
        
        return fragment

    catch err
      console.log "ERROR", err if @verbose
      return callback err.toString()
    
    console.log " - #{params.path}: #{ taglist.sort().join ', ' }" if @verbose and taglist.length > 0
    
    callback null, data:output

