_capitalize = require('lodash.capitalize')

ChannelMixin = ->
  channelNames = Array::slice.call(arguments)

  {
    componentDidMount: ->
      cable = @props.cable or @context.cable
      @mounted = true

      for channel in channelNames
        if cable.channel(channel)
          cable.channel(channel).on 'connected', @handleConnected if @handleConnected?
          cable.channel(channel).on 'disconnected', @handleDisconnected if @handleDisconnected?
          cable.channel(channel).on 'rejected', @handleDisconnected if @handleDisconnected?
          cable.channel(channel).on 'received', @handleReceived if @handleReceived?

          for action in cable.channel(channel).actions
            actionMethod = "handle#{_capitalize(action)}"
            cable.channel(channel).on action, @[actionMethod] if @[actionMethod]?

    componentWillUnmount: ->
      cable = @props.cable or @context.cable
      @mounted = false
      for channel in channelNames
        if cable.channel(channel)
          cable.channel(channel).removeListener 'connected', @handleConnected if @handleConnected?
          cable.channel(channel).removeListener 'disconnected', @handleDisconnected if @handleDisconnected?
          cable.channel(channel).removeListener 'rejected', @handleDisconnected if @handleDisconnected?
          cable.channel(channel).removeListener 'received', @handleReceived if @handleReceived?

          for action in cable.channel(channel).actions
            actionMethod = "handle#{_capitalize(action)}"
            cable.channel(channel).removeListener action, @[actionMethod] if @[actionMethod]?

    perform: (channel, action, data = {}) ->
      cable = @props.cable or @context.cable
      cable.channel(channel).perform(action, data)
  }

ChannelMixin.componentWillMount = ->
  throw new Error('ActionCableReact.ChannelMixin is a function that takes one or more ' + 
    'store names as parameters and returns the mixin, e.g.: ' + 
    'mixins: [ActionCableReact.ChannelMixin("Channel1", "Channel2")]'
  )

module.exports = ChannelMixin
