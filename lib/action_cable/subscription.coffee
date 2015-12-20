class Subscription
  constructor: (@subscriptions, params = {}, @actions) ->
    @identifier = JSON.stringify(params)

    mixin = {}
    for action in actions
      mixin[action] = ->
        @emit(action)

    extend(@, mixin)
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

  extend = (object, properties) ->
    if properties?
      for key, value of properties
        object[key] = value
    object

module.exports = Subscription
