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

	var ChannelMixin, _capitalize;

	_capitalize = __webpack_require__(1);

	ChannelMixin = function() {
	  var channelNames;
	  channelNames = Array.prototype.slice.call(arguments);
	  return {
	    componentDidMount: function() {
	      var action, cable, channel, i, len, results;
	      cable = this.props.cable || this.context.cable;
	      this.mounted = true;
	      results = [];
	      for (i = 0, len = channelNames.length; i < len; i++) {
	        channel = channelNames[i];
	        cable.channel(channel).on('connected', this.handleConnected);
	        cable.channel(channel).on('disconnected', this.handleDisconnected);
	        cable.channel(channel).on('rejected', this.handleDisconnected);
	        results.push((function() {
	          var j, len1, ref, results1;
	          ref = cable.channel(channel).actions;
	          results1 = [];
	          for (j = 0, len1 = ref.length; j < len1; j++) {
	            action = ref[j];
	            results1.push(cable.channel(channel).on(action, this["handle" + (_capitalize(action))]()));
	          }
	          return results1;
	        }).call(this));
	      }
	      return results;
	    },
	    componentWillUnmount: function() {
	      var action, cable, channel, i, len, results;
	      cable = this.props.cable || this.context.cable;
	      this.mounted = false;
	      results = [];
	      for (i = 0, len = channelNames.length; i < len; i++) {
	        channel = channelNames[i];
	        cable.channel(channel).removeListener('connected', this.handleConnected);
	        cable.channel(channel).removeListener('disconnected', this.handleDisconnected);
	        cable.channel(channel).removeListener('rejected', this.handleDisconnected);
	        results.push((function() {
	          var j, len1, ref, results1;
	          ref = cable.channel(channel).actions;
	          results1 = [];
	          for (j = 0, len1 = ref.length; j < len1; j++) {
	            action = ref[j];
	            results1.push(cable.channel(channel).removeListener(action, this["handle" + (_capitalize(action))]()));
	          }
	          return results1;
	        }).call(this));
	      }
	      return results;
	    },
	    perform: function(channel, action, params) {
	      var cable;
	      if (params == null) {
	        params = {};
	      }
	      cable = this.props.cable || this.context.cable;
	      return cable.channel(channel).perform(action, params);
	    }
	  };
	};

	ChannelMixin.componentWillMount = function() {
	  throw new Error('ActionCableReact.ChannelMixin is a function that takes one or more ' + 'store names as parameters and returns the mixin, e.g.: ' + 'mixins: [ActionCableReact.ChannelMixin("Channel1", "Channel2")]');
	};

	module.exports = ChannelMixin;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	var baseToString = __webpack_require__(2);

	/**
	 * Capitalizes the first character of `string`.
	 *
	 * @static
	 * @memberOf _
	 * @category String
	 * @param {string} [string=''] The string to capitalize.
	 * @returns {string} Returns the capitalized string.
	 * @example
	 *
	 * _.capitalize('fred');
	 * // => 'Fred'
	 */
	function capitalize(string) {
	  string = baseToString(string);
	  return string && (string.charAt(0).toUpperCase() + string.slice(1));
	}

	module.exports = capitalize;


/***/ },
/* 2 */
/***/ function(module, exports) {

	/**
	 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */

	/**
	 * Converts `value` to a string if it's not one. An empty string is returned
	 * for `null` or `undefined` values.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {string} Returns the string.
	 */
	function baseToString(value) {
	  return value == null ? '' : (value + '');
	}

	module.exports = baseToString;


/***/ }
/******/ ]);