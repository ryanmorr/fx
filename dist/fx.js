/*! fx v0.1.0 | https://github.com/ryanmorr/fx */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.fx = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Import dependencies
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


exports.default = fx;

var _props = require('./props');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Default animation options
 */
var defaultDuration = 700;
var defaultEasing = 'ease-out';

/**
 * Transitional easing functions
 */
var easingFunctions = {
    linear: function linear(t, b, c, d) {
        return c * t / d + b;
    },
    'ease-in': function easeIn(t, b, c, d) {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    },
    'ease-out': function easeOut(t, b, c, d) {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },
    'ease-in-out': function easeInOut(t, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    }
};

/**
 * Animation class
 *
 * @class FX
 * @api private
 */

var FX = function () {

    /**
     * Instantiate the class providing a
     * CSS selector string or DOM element
     * to be animated
     *
     * @constructor
     * @param {Element|String} el
     * @api private
     */
    function FX(el) {
        _classCallCheck(this, FX);

        this.el = typeof el === 'string' ? document.querySelector(el) : el;
    }

    /**
     * Get the animation element
     *
     * @return {Element}
     * @api public
     */


    _createClass(FX, [{
        key: 'getElement',
        value: function getElement() {
            return this.el;
        }

        /**
         * Animate the element
         *
         * @param {Object} props
         * @param {Number} duration (optional)
         * @param {String} easing (optional)
         * @api public
         */

    }, {
        key: 'animate',
        value: function animate(props) {
            var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultDuration;
            var easing = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultEasing;

            this.duration = duration;
            this.frame = Object.create(null);
            this.easingFunction = easingFunctions[easing];

            var _getProperties = (0, _props.getProperties)(this.el, props);

            var _getProperties2 = _slicedToArray(_getProperties, 2);

            var startProps = _getProperties2[0];
            var endProps = _getProperties2[1];

            this.startProps = startProps;
            this.endProps = endProps;
            requestAnimationFrame(this.step.bind(this));
        }

        /**
         * Advance the properties of the
         * animation by 1 frame
         *
         * @param {Number} timestamp
         * @api private
         */

    }, {
        key: 'step',
        value: function step(timestamp) {
            if (!this.startTime) {
                this.startTime = timestamp;
            }
            if (timestamp < this.startTime + this.duration) {
                this.currentTime = timestamp - this.startTime;
                var prop = void 0,
                    start = void 0,
                    end = void 0;
                for (prop in this.startProps) {
                    start = this.startProps[prop];
                    end = this.endProps[prop];
                    this.frame[prop] = this.easingFunction(this.currentTime, start, end - start, this.duration);
                }
                (0, _props.setProperties)(this.el, this.frame);
                requestAnimationFrame(this.step.bind(this));
            } else {
                (0, _props.setProperties)(this.el, this.endProps);
            }
        }
    }]);

    return FX;
}();

/**
 * Factory function for creating
 * `FX` instances
 *
 * @param {Element|String} tpl
 * @return {FX}
 * @api public
 */


function fx(el) {
    return new FX(el);
}
module.exports = exports['default'];

},{"./props":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * Import dependencies
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          */


exports.getProperties = getProperties;
exports.setProperties = setProperties;

var _util = require('./util');

/**
 * Get the computed value of a style
 * property for an element
 *
 * @param {Element} el
 * @param {String} prop
 * @return {String}
 * @api private
 */
function getStyle(el, prop) {
    var style = document.defaultView.getComputedStyle(el, null);
    return prop in style ? style[prop] : null;
}

/**
 * Get the starting and ending values
 * for each property of an animation
 *
 * @param {Element} el
 * @param {Object} props
 * @return {Array}
 * @api private
 */
function getProperties(el, props) {
    var startProps = Object.create(null);
    var endProps = Object.create(null);
    var prop = void 0,
        value = void 0,
        to = void 0,
        from = void 0;
    for (prop in props) {
        value = props[prop];

        var _ref = (0, _util.isArray)(value) ? value : [null, value];

        var _ref2 = _slicedToArray(_ref, 2);

        from = _ref2[0];
        to = _ref2[1];

        from = from == null ? parseFloat(getStyle(el, prop)) || 0 : from;
        startProps[prop] = from;
        endProps[prop] = to;
    }
    return [startProps, endProps];
}

/**
 * Set the value of each property of
 * an animation for the current frame
 *
 * @param {Element} el
 * @param {Object} frame
 * @api private
 */
function setProperties(el, frame) {
    var prop = void 0,
        value = void 0;
    for (prop in frame) {
        value = frame[prop];
        el.style[prop] = value + 'px';
    }
}

},{"./util":3}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isArray = isArray;
exports.now = now;
/**
 * Common variables
 */
var toString = {}.toString;

/**
 * Is the object an array?
 *
 * @param {*} obj
 * @return {Boolean}
 * @api private
 */
function isArray(obj) {
    if ('isArray' in Array) {
        return Array.isArray(obj);
    }
    return toString.call(obj) === '[object Array]';
}

/**
 * Get a timestamp
 *
 * @return {Number}
 * @api private
 */
function now() {
    if ('performance' in window) {
        return window.performance.now() + window.performance.timing.navigationStart;
    }
    return Date.now();
}

},{}]},{},[1])(1)
});

