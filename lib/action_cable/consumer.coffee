Connection = require('./connection')
ConnectionMonitor = require('./connection_monitor')
Subscriptions = require('./subscriptions')
Subscription = require('./subscription')

class Consumer
  constructor: (@url) ->
    @subscriptions = new Subscriptions(@)
    @connection = new Connection(@)
    @connectionMonitor = new ConnectionMonitor(@)

  send: (data) ->
    @connection.send(data)

  inspect: ->
    JSON.stringify(@, null, 2)

  toJSON: ->
    { @url, @subscriptions, @connection, @connectionMonitor }

module.exports = Consumer
