EventEmitter = require('eventemitter3')

class Subscription extends EventEmitter
  constructor: (@subscriptions, params = {}, @actions = []) ->
    @identifier = JSON.stringify(params)
    @subscriptions.add(@)
    @consumer = @subscriptions.consumer

  # Perform a channel action with the optional data passed as an attribute
  perform: (action, data = {}) ->
    data.action = action
    @send(data)

  send: (data) ->
    @consumer.send(command: 'message', identifier: @identifier, data: JSON.stringify(data))

  unsubscribe: ->
    @subscriptions.remove(@)

  connected: ->
    @emit('connected')

  disconnected: ->
    @emit('disconnected')

  rejected: ->
    @emit('rejected')

  received: (data) ->
    if data.action in @actions
      @emit(data.action, data)
    else
      @emit('received', data)

module.exports = Subscription
