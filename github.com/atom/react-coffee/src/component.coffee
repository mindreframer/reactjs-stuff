React = require 'react'
Delegator = require 'delegato'
PropertyAccessors = require 'property-accessors'
DOMBuilder = require './dom-builder'
ExampleReactComponent = React.createClass(render: ->).componentConstructor.prototype

module.exports =
class Component
  Delegator.includeInto(this)
  PropertyAccessors.includeInto(this)
  DOMBuilder.includeInto(this)

  for key, value of ExampleReactComponent when key isnt 'constructor' and typeof value is 'function'
    @delegatesMethod key, toProperty: 'wrappedComponent'

  @delegatesProperties 'props', 'state', 'refs', toProperty: 'wrappedComponent'

  @getWrappedComponentClass: ->
    @wrappedComponentClass ?= React.createClass
      displayName: @name
      render: -> @wrapper.render()
      getInitialState: (-> @wrapper.getInitialState()) if @::getInitialState?
      getDefaultProps: (-> @wrapper.getDefaultProps()) if @::getDefaultProps?
      propTypes: @::propTypes
      mixins: @::mixins
      componentWillMount: (-> @wrapper.componentWillMount()) if @::componentWillMount?
      componentDidMount: (args...) ->
        @wrapper.updateRefs()
        @wrapper.componentDidMount?(args...)
      componentWillReceiveProps: ((args...) -> @wrapper.componentWillReceiveProps(args...)) if @::componentWillReceiveProps?
      shouldComponentUpdate: (-> @wrapper.shouldComponentUpdate()) if @::shouldComponentUpdate?
      componentWillUpdate: ((args...) -> @wrapper.componentWillUpdate(args...)) if @::componentWillUpdate?
      componentDidUpdate: (args...) ->
        @wrapper.updateRefs()
        @wrapper.componentDidUpdate?(args...)
      componentWillUnmount: (-> @wrapper.componentWillUnmount()) if @::componentWillUnmount?

  constructor: (args...) ->
    @wrappedComponent = @constructor.getWrappedComponentClass()(args...)
    @wrappedComponent.wrapper = this
    @refs = {}

  render: ->
    throw new Error("You must implement ::render on component #{@constructor.displayName ? @constructor.name}")

  @::lazyAccessor 'element', ->
    container = document.createElement('div')
    React.renderComponent(@wrappedComponent, container)
    container.firstChild

  updateRefs: ->
    for name of @refs
      delete @refs[name] unless @wrappedComponent.refs[name]?

    for name, {wrapper} of @wrappedComponent.refs
      @refs[name] = wrapper
