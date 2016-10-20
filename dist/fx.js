/*! fx v0.1.0 | https://github.com/ryanmorr/fx */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.fx = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
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
 * Export easing functions
 */
exports.default = easingFunctions;
module.exports = exports['default'];

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Import dependencies
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


exports.default = fx;

var _easing = require('./easing');

var _easing2 = _interopRequireDefault(_easing);

var _props = require('./props');

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Default animation options
 */
var defaultDuration = 700;
var defaultEasing = 'ease-out';

/**
 * Animation class
 *
 * @class FX
 * @api public
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
        this.animating = false;
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
         * Is the animation element currently
         * animating
         *
         * @return {Boolean}
         * @api public
         */

    }, {
        key: 'isAnimating',
        value: function isAnimating() {
            return this.animating;
        }

        /**
         * Animate the element
         *
         * @param {Object} props
         * @param {Number} duration (optional)
         * @param {String} easing (optional)
         * @param {Promise}
         * @api public
         */

    }, {
        key: 'animate',
        value: function animate(props) {
            var _this = this;

            var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultDuration;
            var easing = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultEasing;

            this.animating = true;
            return new Promise(function (resolve) {
                var el = _this.el;
                var frame = Object.create(null);
                var easingFunction = _easing2.default[easing];
                var startTime = void 0,
                    currentTime = void 0,
                    startProps = void 0,
                    endProps = void 0;
                var step = function step(timestamp) {
                    if (!startTime) {
                        startTime = timestamp;
                    }
                    if (timestamp < startTime + duration) {
                        currentTime = timestamp - startTime;
                        var start = void 0,
                            end = void 0,
                            prop = void 0,
                            i = void 0,
                            len = void 0;
                        for (prop in startProps) {
                            start = startProps[prop];
                            end = endProps[prop];
                            if ((0, _util.isArray)(start)) {
                                frame[prop] = [];
                                for (i = 0, len = start.length; i < len; i++) {
                                    frame[prop][i] = easingFunction(currentTime, start[i], end[i] - start[i], duration);
                                }
                            } else {
                                frame[prop] = easingFunction(currentTime, start, end - start, duration);
                            }
                        }
                        (0, _props.setProperties)(el, frame);
                        requestAnimationFrame(step);
                    } else {
                        (0, _props.setProperties)(el, endProps);
                        _this.animating = false;
                        resolve();
                    }
                };
                requestAnimationFrame(function () {
                    var _getProperties = (0, _props.getProperties)(el, props);

                    var _getProperties2 = _slicedToArray(_getProperties, 2);

                    startProps = _getProperties2[0];
                    endProps = _getProperties2[1];

                    requestAnimationFrame(step);
                });
            });
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

},{"./easing":1,"./props":3,"./util":4}],3:[function(require,module,exports){
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
 * Common variables
 */
var has = {}.hasOwnProperty;
var floor = Math.floor;

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
    var style = el.ownerDocument.defaultView.getComputedStyle(el, null);
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
        if (has.call(props, prop)) {
            value = props[prop];

            var _ref = (0, _util.isArray)(value) ? value : [null, value];

            var _ref2 = _slicedToArray(_ref, 2);

            from = _ref2[0];
            to = _ref2[1];

            if ((0, _util.includes)(prop, 'color')) {
                from = from == null ? getStyle(el, prop) : from;
                startProps[prop] = (0, _util.parseColor)(from);
                endProps[prop] = (0, _util.parseColor)(to);
            } else if (prop === 'scrollTop' || prop === 'scrollLeft') {
                from = from == null ? el[prop] : from;
                startProps[prop] = from;
                endProps[prop] = to;
            } else {
                from = from == null ? parseFloat(getStyle(el, prop)) || 0 : from;
                startProps[prop] = from;
                endProps[prop] = to;
            }
        }
    }
    return [startProps, endProps];
}

/**
 * Set multiple style properties for
 * an element
 *
 * @param {Element} el
 * @param {Object} props
 * @api private
 */
function setProperties(el, props) {
    var prop = void 0,
        value = void 0;
    for (prop in props) {
        value = props[prop];
        if ((0, _util.includes)(prop, 'color')) {
            el.style[prop] = 'rgb(' + floor(value[0]) + ', ' + floor(value[1]) + ', ' + floor(value[2]) + ')';
        } else if (prop === 'scrollTop' || prop === 'scrollLeft') {
            el[prop] = value;
        } else {
            el.style[prop] = value + 'px';
        }
    }
}

},{"./util":4}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isArray = isArray;
exports.now = now;
exports.includes = includes;
exports.parseColor = parseColor;
/**
 * Common variables
 */
var toString = {}.toString;
var hex6Re = /^#?(\w{2})(\w{2})(\w{2})$/;
var hex3Re = /^#?(\w{1})(\w{1})(\w{1})$/;
var rgbRe = /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/;
var colorCache = Object.create(null);

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

/**
 * Does the string contain the
 * provided string
 *
 * @param {String} str
 * @param {String} searchStr
 * @return {Boolean}
 * @api private
 */
function includes(str, searchStr) {
    str = str.toLowerCase();
    if (str.includes) {
        return str.includes(searchStr);
    }
    return str.indexOf(searchStr) !== -1;
}

/**
 * Parse a CSS color hex and rgb value
 * to extract the numberic codes
 *
 * @param {String} str
 * @return {Array}
 * @api private
 */
function parseColor(str) {
    if (str in colorCache) {
        return colorCache[str];
    }
    var color = str.match(hex6Re),
        value = void 0;
    if (color && color.length === 4) {
        value = [parseInt(color[1], 16), parseInt(color[2], 16), parseInt(color[3], 16)];
        colorCache[str] = value;
        return value;
    }
    color = str.match(rgbRe);
    if (color && color.length === 4) {
        value = [parseInt(color[1], 10), parseInt(color[2], 10), parseInt(color[3], 10)];
        colorCache[str] = value;
        return value;
    }
    color = str.match(hex3Re);
    if (color && color.length === 4) {
        value = [parseInt(color[1] + color[1], 16), parseInt(color[2] + color[2], 16), parseInt(color[3] + color[3], 16)];
        colorCache[str] = value;
        return value;
    }
}

},{}]},{},[2])(2)
});

