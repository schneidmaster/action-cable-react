_capitalize = require('lodash.capitalize')

ChannelMixin = ->
  channelNames = Array::slice.call(arguments)

  {
    componentDidMount: ->
      cable = @props.cable or @context.cable
      @mounted = true

      for channel in channelNames
        cable.channel(channel).on 'connected', @handleConnected
        cable.channel(channel).on 'disconnected', @handleDisconnected
        cable.channel(channel).on 'rejected', @handleDisconnected

        for action in cable.channel(channel).actions
          cable.channel(channel).on action, @["handle#{_capitalize(action)}"]()

    componentWillUnmount: ->
      cable = @props.cable or @context.cable
      @mounted = false
      for channel in channelNames
        cable.channel(channel).removeListener 'connected', @handleConnected
        cable.channel(channel).removeListener 'disconnected', @handleDisconnected
        cable.channel(channel).removeListener 'rejected', @handleDisconnected

        for action in cable.channel(channel).actions
          cable.channel(channel).removeListener action, @["handle#{_capitalize(action)}"]()

    perform: (channel, action, params = {}) ->
      cable = @props.cable or @context.cable
      cable.channel(channel).perform(action, params)
  }

ChannelMixin.componentWillMount = ->
  throw new Error('ActionCableReact.ChannelMixin is a function that takes one or more ' + 
    'store names as parameters and returns the mixin, e.g.: ' + 
    'mixins: [ActionCableReact.ChannelMixin("Channel1", "Channel2")]'
  )

module.exports = ChannelMixin
