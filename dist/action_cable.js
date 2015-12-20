/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var ActionCable, Consumer;

	Consumer = __webpack_require__(1);

	ActionCable = (function() {
	  function ActionCable() {}

	  ActionCable.prototype.createConsumer = function(url) {
	    return new ActionCable.Consumer(this.createWebSocketURL(url));
	  };

	  ActionCable.prototype.createWebSocketURL = function(url) {
	    var a;
	    if (url && !/^wss?:/i.test(url)) {
	      a = document.createElement('a');
	      a.href = url;
	      a.href = a.href;
	      a.protocol = a.protocol.replace('http', 'ws');
	      return a.href;
	    } else {
	      return url;
	    }
	  };

	  return ActionCable;

	})();

	module.exports = ActionCable;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Connection, ConnectionMonitor, Consumer, Subscription, Subscriptions;

	Connection = __webpack_require__(2);

	ConnectionMonitor = __webpack_require__(4);

	Subscriptions = __webpack_require__(5);

	Subscription = __webpack_require__(6);

	Consumer = (function() {
	  function Consumer(url) {
	    this.url = url;
	    this.subscriptions = new ActionCable.Subscriptions(this);
	    this.connection = new ActionCable.Connection(this);
	    this.connectionMonitor = new ActionCable.ConnectionMonitor(this);
	  }

	  Consumer.prototype.send = function(data) {
	    return this.connection.send(data);
	  };

	  Consumer.prototype.inspect = function() {
	    return JSON.stringify(this, null, 2);
	  };

	  Consumer.prototype.toJSON = function() {
	    return {
	      url: this.url,
	      subscriptions: this.subscriptions,
	      connection: this.connection,
	      connectionMonitor: this.connectionMonitor
	    };
	  };

	  return Consumer;

	})();

	module.exports = Consumer;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Connection, message_types,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  slice = [].slice,
	  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

	message_types = __webpack_require__(3).message_types;

	Connection = (function() {
	  Connection.reopenDelay = 500;

	  function Connection(consumer) {
	    this.consumer = consumer;
	    this.open = bind(this.open, this);
	    this.open();
	  }

	  Connection.prototype.send = function(data) {
	    if (this.isOpen()) {
	      this.webSocket.send(JSON.stringify(data));
	      return true;
	    } else {
	      return false;
	    }
	  };

	  Connection.prototype.open = function() {
	    if (this.webSocket && !this.isState('closed')) {
	      throw new Error('Existing connection must be closed before opening');
	    } else {
	      this.webSocket = new WebSocket(this.consumer.url);
	      this.installEventHandlers();
	      return true;
	    }
	  };

	  Connection.prototype.close = function() {
	    var ref;
	    return (ref = this.webSocket) != null ? ref.close() : void 0;
	  };

	  Connection.prototype.reopen = function() {
	    if (this.isState('closed')) {
	      return this.open();
	    } else {
	      try {
	        return this.close();
	      } finally {
	        setTimeout(this.open, this.constructor.reopenDelay);
	      }
	    }
	  };

	  Connection.prototype.isOpen = function() {
	    return this.isState('open');
	  };

	  Connection.prototype.isState = function() {
	    var ref, states;
	    states = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	    return ref = this.getState(), indexOf.call(states, ref) >= 0;
	  };

	  Connection.prototype.getState = function() {
	    var ref, state, value;
	    for (state in WebSocket) {
	      value = WebSocket[state];
	      if (value === ((ref = this.webSocket) != null ? ref.readyState : void 0)) {
	        return state.toLowerCase();
	      }
	    }
	    return null;
	  };

	  Connection.prototype.installEventHandlers = function() {
	    var eventName, handler;
	    for (eventName in this.events) {
	      handler = this.events[eventName].bind(this);
	      this.webSocket["on" + eventName] = handler;
	    }
	  };

	  Connection.prototype.events = {
	    message: function(event) {
	      var identifier, message, ref, type;
	      ref = JSON.parse(event.data), identifier = ref.identifier, message = ref.message, type = ref.type;
	      switch (type) {
	        case message_types.confirmation:
	          return this.consumer.subscriptions.notify(identifier, 'connected');
	        case message_types.rejection:
	          return this.consumer.subscriptions.reject(identifier);
	        default:
	          return this.consumer.subscriptions.notify(identifier, 'received', message);
	      }
	    },
	    open: function() {
	      this.disconnected = false;
	      return this.consumer.subscriptions.reload();
	    },
	    close: function() {
	      return this.disconnect();
	    },
	    error: function() {
	      return this.disconnect();
	    }
	  };

	  Connection.prototype.disconnect = function() {
	    if (this.disconnected) {
	      return;
	    }
	    this.disconnected = true;
	    return this.consumer.subscriptions.notifyAll('disconnected');
	  };

	  Connection.prototype.toJSON = function() {
	    return {
	      state: this.getState()
	    };
	  };

	  return Connection;

	})();

	module.exports = Connection;


/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = {
	  identifiers: {
	    ping: '_ping'
	  },
	  message_types: {
	    confirmation: 'confirm_subscription',
	    rejection: 'reject_subscription'
	  }
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var ConnectionMonitor, INTERNAL,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

	INTERNAL = __webpack_require__(3);

	ConnectionMonitor = (function() {
	  var clamp, now, secondsSince;

	  ConnectionMonitor.pollInterval = {
	    min: 3,
	    max: 30
	  };

	  ConnectionMonitor.staleThreshold = 6;

	  ConnectionMonitor.prototype.identifier = INTERNAL.identifiers.ping;

	  function ConnectionMonitor(consumer) {
	    this.consumer = consumer;
	    this.visibilityDidChange = bind(this.visibilityDidChange, this);
	    this.consumer.subscriptions.add(this);
	    this.start();
	  }

	  ConnectionMonitor.prototype.connected = function() {
	    this.reset();
	    this.pingedAt = now();
	    return delete this.disconnectedAt;
	  };

	  ConnectionMonitor.prototype.disconnected = function() {
	    return this.disconnectedAt = now();
	  };

	  ConnectionMonitor.prototype.received = function() {
	    return this.pingedAt = now();
	  };

	  ConnectionMonitor.prototype.reset = function() {
	    return this.reconnectAttempts = 0;
	  };

	  ConnectionMonitor.prototype.start = function() {
	    this.reset();
	    delete this.stoppedAt;
	    this.startedAt = now();
	    this.poll();
	    return document.addEventListener('visibilitychange', this.visibilityDidChange);
	  };

	  ConnectionMonitor.prototype.stop = function() {
	    this.stoppedAt = now();
	    return document.removeEventListener('visibilitychange', this.visibilityDidChange);
	  };

	  ConnectionMonitor.prototype.poll = function() {
	    return setTimeout((function(_this) {
	      return function() {
	        if (!_this.stoppedAt) {
	          _this.reconnectIfStale();
	          return _this.poll();
	        }
	      };
	    })(this), this.getInterval());
	  };

	  ConnectionMonitor.prototype.getInterval = function() {
	    var interval, max, min, ref;
	    ref = this.constructor.pollInterval, min = ref.min, max = ref.max;
	    interval = 5 * Math.log(this.reconnectAttempts + 1);
	    return clamp(interval, min, max) * 1000;
	  };

	  ConnectionMonitor.prototype.reconnectIfStale = function() {
	    if (this.connectionIsStale()) {
	      this.reconnectAttempts++;
	      if (!this.disconnectedRecently()) {
	        return this.consumer.connection.reopen();
	      }
	    }
	  };

	  ConnectionMonitor.prototype.connectionIsStale = function() {
	    var ref;
	    return secondsSince((ref = this.pingedAt) != null ? ref : this.startedAt) > this.constructor.staleThreshold;
	  };

	  ConnectionMonitor.prototype.disconnectedRecently = function() {
	    return this.disconnectedAt && secondsSince(this.disconnectedAt) < this.constructor.staleThreshold;
	  };

	  ConnectionMonitor.prototype.visibilityDidChange = function() {
	    if (document.visibilityState === 'visible') {
	      return setTimeout((function(_this) {
	        return function() {
	          if (_this.connectionIsStale() || !_this.consumer.connection.isOpen()) {
	            return _this.consumer.connection.reopen();
	          }
	        };
	      })(this), 200);
	    }
	  };

	  ConnectionMonitor.prototype.toJSON = function() {
	    var connectionIsStale, interval;
	    interval = this.getInterval();
	    connectionIsStale = this.connectionIsStale();
	    return {
	      startedAt: this.startedAt,
	      stoppedAt: this.stoppedAt,
	      pingedAt: this.pingedAt,
	      reconnectAttempts: this.reconnectAttempts,
	      connectionIsStale: connectionIsStale,
	      interval: interval
	    };
	  };

	  now = function() {
	    return new Date().getTime();
	  };

	  secondsSince = function(time) {
	    return (now() - time) / 1000;
	  };

	  clamp = function(number, min, max) {
	    return Math.max(min, Math.min(max, number));
	  };

	  return ConnectionMonitor;

	})();

	module.exports = ConnectionMonitor;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var INTERNAL, Subscriptions,
	  slice = [].slice;

	INTERNAL = __webpack_require__(3);

	Subscriptions = (function() {
	  function Subscriptions(consumer) {
	    this.consumer = consumer;
	    this.subscriptions = [];
	    this.history = [];
	  }

	  Subscriptions.prototype.create = function(channelName, actions) {
	    var channel, params;
	    if (actions == null) {
	      actions = [];
	    }
	    channel = channelName;
	    params = typeof channel === 'object' ? channel : {
	      channel: channel
	    };
	    return new ActionCable.Subscription(this, params, actions);
	  };

	  Subscriptions.prototype.add = function(subscription) {
	    this.subscriptions.push(subscription);
	    this.notify(subscription, 'initialized');
	    return this.sendCommand(subscription, 'subscribe');
	  };

	  Subscriptions.prototype.remove = function(subscription) {
	    this.forget(subscription);
	    if (!this.findAll(subscription.identifier).length) {
	      return this.sendCommand(subscription, 'unsubscribe');
	    }
	  };

	  Subscriptions.prototype.reject = function(identifier) {
	    var i, len, ref, results, subscription;
	    ref = this.findAll(identifier);
	    results = [];
	    for (i = 0, len = ref.length; i < len; i++) {
	      subscription = ref[i];
	      this.forget(subscription);
	      results.push(this.notify(subscription, 'rejected'));
	    }
	    return results;
	  };

	  Subscriptions.prototype.forget = function(subscription) {
	    var s;
	    return this.subscriptions = (function() {
	      var i, len, ref, results;
	      ref = this.subscriptions;
	      results = [];
	      for (i = 0, len = ref.length; i < len; i++) {
	        s = ref[i];
	        if (s !== subscription) {
	          results.push(s);
	        }
	      }
	      return results;
	    }).call(this);
	  };

	  Subscriptions.prototype.findAll = function(identifier) {
	    var i, len, ref, results, s;
	    ref = this.subscriptions;
	    results = [];
	    for (i = 0, len = ref.length; i < len; i++) {
	      s = ref[i];
	      if (s.identifier === identifier) {
	        results.push(s);
	      }
	    }
	    return results;
	  };

	  Subscriptions.prototype.reload = function() {
	    var i, len, ref, results, subscription;
	    ref = this.subscriptions;
	    results = [];
	    for (i = 0, len = ref.length; i < len; i++) {
	      subscription = ref[i];
	      results.push(this.sendCommand(subscription, 'subscribe'));
	    }
	    return results;
	  };

	  Subscriptions.prototype.notifyAll = function() {
	    var args, callbackName, i, len, ref, results, subscription;
	    callbackName = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
	    ref = this.subscriptions;
	    results = [];
	    for (i = 0, len = ref.length; i < len; i++) {
	      subscription = ref[i];
	      results.push(this.notify.apply(this, [subscription, callbackName].concat(slice.call(args))));
	    }
	    return results;
	  };

	  Subscriptions.prototype.notify = function() {
	    var args, callbackName, i, identifier, len, results, subscription, subscriptions;
	    subscription = arguments[0], callbackName = arguments[1], args = 3 <= arguments.length ? slice.call(arguments, 2) : [];
	    if (typeof subscription === 'string') {
	      subscriptions = this.findAll(subscription);
	    } else {
	      subscriptions = [subscription];
	    }
	    results = [];
	    for (i = 0, len = subscriptions.length; i < len; i++) {
	      subscription = subscriptions[i];
	      if (typeof subscription[callbackName] === "function") {
	        subscription[callbackName].apply(subscription, args);
	      }
	      if (callbackName === 'initialized' || callbackName === 'connected' || callbackName === 'disconnected' || callbackName === 'rejected') {
	        identifier = subscription.identifier;
	        results.push(this.record({
	          notification: {
	            identifier: identifier,
	            callbackName: callbackName,
	            args: args
	          }
	        }));
	      } else {
	        results.push(void 0);
	      }
	    }
	    return results;
	  };

	  Subscriptions.prototype.sendCommand = function(subscription, command) {
	    var identifier;
	    identifier = subscription.identifier;
	    if (identifier === INTERNAL.identifiers.ping) {
	      return this.consumer.connection.isOpen();
	    } else {
	      return this.consumer.send({
	        command: command,
	        identifier: identifier
	      });
	    }
	  };

	  Subscriptions.prototype.record = function(data) {
	    data.time = new Date();
	    this.history = this.history.slice(-19);
	    return this.history.push(data);
	  };

	  Subscriptions.prototype.toJSON = function() {
	    var subscription;
	    return {
	      history: this.history,
	      identifiers: (function() {
	        var i, len, ref, results;
	        ref = this.subscriptions;
	        results = [];
	        for (i = 0, len = ref.length; i < len; i++) {
	          subscription = ref[i];
	          results.push(subscription.identifier);
	        }
	        return results;
	      }).call(this)
	    };
	  };

	  return Subscriptions;

	})();

	module.exports = Subscriptions;


/***/ },
/* 6 */
/***/ function(module, exports) {

	var Subscription;

	Subscription = (function() {
	  var extend;

	  function Subscription(subscriptions, params, actions1) {
	    var action, i, len, mixin;
	    this.subscriptions = subscriptions;
	    if (params == null) {
	      params = {};
	    }
	    this.actions = actions1;
	    this.identifier = JSON.stringify(params);
	    mixin = {};
	    for (i = 0, len = actions.length; i < len; i++) {
	      action = actions[i];
	      mixin[action] = function() {
	        return this.emit(action);
	      };
	    }
	    extend(this, mixin);
	    this.subscriptions.add(this);
	    this.consumer = this.subscriptions.consumer;
	  }

	  Subscription.prototype.perform = function(action, data) {
	    if (data == null) {
	      data = {};
	    }
	    data.action = action;
	    return this.send(data);
	  };

	  Subscription.prototype.send = function(data) {
	    return this.consumer.send({
	      command: 'message',
	      identifier: this.identifier,
	      data: JSON.stringify(data)
	    });
	  };

	  Subscription.prototype.unsubscribe = function() {
	    return this.subscriptions.remove(this);
	  };

	  extend = function(object, properties) {
	    var key, value;
	    if (properties != null) {
	      for (key in properties) {
	        value = properties[key];
	        object[key] = value;
	      }
	    }
	    return object;
	  };

	  return Subscription;

	})();

	module.exports = Subscription;


/***/ }
/******/ ]);