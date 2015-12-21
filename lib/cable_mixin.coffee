CableMixin = (React) ->
  componentWillMount: ->
    unless @props.cable || (@context && @context.cable)
      namePart = if @constructor.displayName then ' of ' + @constructor.displayName else ''
      throw new Error("Could not find cable on this.props or this.context#{namePart}")

  childContextTypes:
    cable:
      React.PropTypes.object
  
  contextTypes:
    cable:
      React.PropTypes.object

  getChildContext: ->
    {
      cable: @getCable()
    }
  
  getCable: ->
    @props.cable or @context and @context.cable

CableMixin.componentWillMount = ->
  throw new Error('ActionCableReact.CableMixin is a function that takes React as a ' + 
    'parameter and returns the mixin, e.g.: mixins: [ActionCableReact.CableMixin(React)]'
  )

module.exports = CableMixin
