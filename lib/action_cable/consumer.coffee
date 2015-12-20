Connection = require('./connection')
ConnectionMonitor = require('./connection_monitor')
Subscriptions = require('./subscriptions')
Subscription = require('./subscription')

class Consumer
  constructor: (@url) ->
    @subscriptions = new ActionCable.Subscriptions(@)
    @connection = new ActionCable.Connection(@)
    @connectionMonitor = new ActionCable.ConnectionMonitor(@)

  send: (data) ->
    @connection.send(data)

  inspect: ->
    JSON.stringify(@, null, 2)

  toJSON: ->
    { @url, @subscriptions, @connection, @connectionMonitor }

module.exports = Consumer
