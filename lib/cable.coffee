class Cable
  constructor: (@channels) ->
    #

  channel: (name) ->
    @channels[name]

module.exports = Cable
