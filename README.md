[![npm version](https://badge.fury.io/js/action-cable-react.svg)](https://badge.fury.io/js/action-cable-react)
[![Bower version](https://badge.fury.io/bo/action-cable-react.svg)](https://badge.fury.io/bo/action-cable-react)

# ActionCable + React

Use Rails 5 ActionCable channels with React for realtime magic.

## Overview

action-cable-react is a npm/bower package to bind one or more [ActionCable](https://github.com/rails/rails/tree/master/actioncable) channels to React components. This allows you to define how each individual component should respond to new messages from each channel, bringing ActionCable nicely in line with the React data model and permitting usage with a Rails API and standalone frontend React application.

Make sure to check out the example [server](https://github.com/schneidmaster/action-cable-react-example-server) and client ([ES6](https://github.com/schneidmaster/action-cable-react-example-client) or [CoffeeScript](https://github.com/schneidmaster/action-cable-react-example-coffee)) applications to try it out for yourself.

## Usage

The action-cable-react package exposes four modules: ActionCable, Cable, CableMixin, and ChannelMixin. With npm or webpack-type setups, you can `require` or `import` them as usual; for bower, they are set as window globals under ActionCableReact (e.g. `window.ActionCableReact.ActionCable`).

First, you need to define your ActionCable channels in your application setup (like `app.js`). Create your consumer:

```javascript
var actionCable = ActionCable.createConsumer('ws://localhost:3000/cable');
```

Then, create a new Cable object with your channels:

```javascript
var cable = new Cable({
  ChatChannel: actionCable.subscriptions.create({channel: 'ChatChannel', room: 'example_room'}, ['newMessage'])
});
```

action-cable-react breaks slightly with the documented Rails method for creating a new channel here. It accepts either a channel name or a params object as the first argument, but as the second argument, it accepts an array of message types rather than an object of message handler definitions. These message types are automatically mapped to corresponding methods on React components -- for example, as we will see in a moment, a React component with the ChatChannel mixed in will automatically have the `handleNewMessage` method triggered when a new message of type `newMessage` is received.

Finally, when rendering your root React component, pass along the cable object in the props, e.g.:

```javascript
ReactDOM.render(<MyRootComponent cable={cable} />, document.getElementById('app'))
```

That covers the ActionCable and Cable modules -- now for the CableMixin and ChannelMixin. The CableMixin must be included in any React component that needs to be bound to one or more ActionCable channels. It needs the React module as an argument, e.g.:

```javascript
import { CableMixin } from 'action-cable-react';
import React from 'react';

module.exports = React.createClass({
  mixins: [CableMixin(React)],
  ...
});
```

The ChannelMixin is used to bind one or more channels to a given component. It accepts an array of channel names as an argument, e.g.:

```javascript
import { CableMixin, ChannelMixin } from 'action-cable-react';
import React from 'react';

module.exports = React.createClass({
  mixins: [CableMixin(React), ChannelMixin('ChatChannel')],
  ...
});
```

The ChannelMixin gives you a handful of component methods by default:

* `handleConnected()`, called when the channel is initialized
* `handleDisconnected()`, called when the channel is disconnected or if it is rejected
* `handleReceived(data)`, called when a message is received from a channel that does not match a message type defined when the channel was created (like 'newMessage' above). `data` is an object.
* `perform: (channel, action, data = {})`, used to send a message to the ActionCable server. `channel` is the channel name (like 'ChatChannel' above), `action` is the action to trigger on the channel (like 'newMessage'), and `data` is any other data that needs to be sent (like the contents of the message in the example below).

Additionally, if you defined any message types when initializing the channel, you automatically get those message types as component methods. For our example above, we automatically get a `handleNewMessage(data)` method because we defined the 'newMessage' message type. Note that if a message type is defined, the default `handleReceived(data)` method will *not* be called for that message.

Let's look at it all together in a simple chatroom component:

```javascript
import { CableMixin, ChannelMixin } from 'action-cable-react';
import React from 'react';

module.exports = React.createClass({
  mixins: [CableMixin(React), ChannelMixin('ChatChannel')],

  getInitialState() {
    return {
      messages: []
    }
  },

  handleConnected() {
    console.log('Connected!')
  },

  handleDisconnected() {
    console.log('Disconnected!')
  },

  handleNewMessage(data) {
    console.log('New message: ' + data.message);
    this.setState((state) => { messages: state.messages.push(data) });
  },

  handleSend() {
    this.perform('ChatChannel', 'newMessage', { timestamp: Date.now(), message: document.getElementById('message').value });
    document.getElementById('message').value = '';
  },

  render() {
    var messages = [];
    for(var i = 0; i < this.state.messages.length; i++) {
      messages.push(<div key={this.state.messages[i].timestamp}>{this.state.messages[i].message}</div>)
    }
    return (
      <div>
        <div>
          {messages}
        </div>
        <input id={'message'} />
        <button onClick={this.handleSend}>Send</button>
      </div>
    )
  }
});
```

The full example is available on [GitHub](https://github.com/schneidmaster/action-cable-react-example-client) as well as a companion [server](https://github.com/schneidmaster/action-cable-react-example-server) application. (Or, check it out in [CoffeeScript](https://github.com/schneidmaster/action-cable-react-example-coffee).)

## Contributing

1. Fork it ( https://schneidmaster/action-cable-react/fork )
2. Create your feature branch (git checkout -b my-new-feature)
3. Commit your changes (git commit -am 'Add some feature')
4. Push to the branch (git push origin my-new-feature)
5. Create a new Pull Request

## Credits

Obviously, this project is heavily indebted to the entire Rails team, and most of the code in `lib/action_cable` is taken directly from Rails 5. This project also referenced [fluxxor](https://github.com/BinaryMuse/fluxxor) for implementation details and props binding.

## License

MIT
