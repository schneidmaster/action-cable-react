Consumer = require('./consumer')

ActionCable =
  createConsumer: (url) ->
    new Consumer @createWebSocketURL(url)

  createWebSocketURL: (url) ->
    if url and not /^wss?:/i.test(url)
      a = document.createElement('a')
      a.href = url
      # Fix populating Location properties in IE. Otherwise, protocol will be blank.
      a.href = a.href
      a.protocol = a.protocol.replace('http', 'ws')
      a.href
    else
      url

module.exports = ActionCable
