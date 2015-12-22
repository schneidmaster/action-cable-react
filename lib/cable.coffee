class Cable
  constructor: (@channels) ->
    #

  channel: (name) ->
    @channels[name]

  setChannel: (name, channel) ->
    @channels[name] = channel

module.exports = Cable
