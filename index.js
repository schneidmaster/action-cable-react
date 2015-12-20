var ActionCable = require('./dist/action_cable.min'),
    Cable = require('./dist/cable.min'),
    CableMixin = require('./dist/cable_mixin.min'),
    ChannelMixin = require('./dist/channel_mixin.min');

var ActionCableReact = {
  ActionCable: ActionCable,
  Cable: Cable,
  CableMixin: CableMixin,
  ChannelMixin: ChannelMixin,
  version: require('./version')
};

module.exports = ActionCableReact;
