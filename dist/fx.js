/*! fx v0.1.0 | https://github.com/ryanmorr/fx */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.fx = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/* eslint-disable max-len */

/**
 * Robert Penner's easing functions
 * http://robertpenner.com/easing/
 */
var easingFunctions = {
    linear: function linear(t, b, c, d) {
        return c * t / d + b;
    },
    'ease-in-quad': function easeInQuad(t, b, c, d) {
        return c * (t /= d) * t + b;
    },
    'ease-out-quad': function easeOutQuad(t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
    },
    'ease-in-out-quad': function easeInOutQuad(t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t + b;
        }
        return -c / 2 * (--t * (t - 2) - 1) + b;
    },
    'ease-in-cubic': function easeInCubic(t, b, c, d) {
        return c * (t /= d) * t * t + b;
    },
    'ease-out-cubic': function easeOutCubic(t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b;
    },
    'ease-in-out-cubic': function easeInOutCubic(t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t * t + b;
        }
        return c / 2 * ((t -= 2) * t * t + 2) + b;
    },
    'ease-in-quart': function easeInQuart(t, b, c, d) {
        return c * (t /= d) * t * t * t + b;
    },
    'ease-out-quart': function easeOutQuart(t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    },
    'ease-in-out-quart': function easeInOutQuart(t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t * t * t + b;
        }
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    },
    'ease-in-quint': function easeInQuint(t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b;
    },
    'ease-out-quint': function easeOutQuint(t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    },
    'ease-in-out-quint': function easeInOutQuint(t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t * t * t * t + b;
        }
        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
    },
    'ease-in-sine': function easeInSine(t, b, c, d) {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    },
    'ease-out-sine': function easeOutSine(t, b, c, d) {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },
    'ease-in-out-sine': function easeInOutSine(t, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    },
    'ease-in-expo': function easeInExpo(t, b, c, d) {
        return t === 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
    },
    'ease-out-expo': function easeOutExpo(t, b, c, d) {
        return t === d ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
    },
    'ease-in-out-expo': function easeInOutExpo(t, b, c, d) {
        if (t === 0) {
            return b;
        }
        if (t === d) {
            return b + c;
        }
        if ((t /= d / 2) < 1) {
            return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        }
        return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
    },
    'ease-in-circ': function easeInCirc(t, b, c, d) {
        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    },
    'ease-out-circ': function easeOutCirc(t, b, c, d) {
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    },
    'ease-in-out-circ': function easeInOutCirc(t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        }
        return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
    },
    'ease-in-elastic': function easeInElastic(t, b, c, d) {
        var a = void 0,
            p = void 0,
            s = void 0;
        s = 1.70158;
        p = 0;
        a = c;
        if (t === 0) {
            return b;
        } else if ((t /= d) === 1) {
            return b + c;
        }
        if (!p) {
            p = d * 0.3;
        }
        if (a < Math.abs(c)) {
            a = c;
            s = p / 4;
        } else {
            s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    },
    'ease-out-elastic': function easeOutElastic(t, b, c, d) {
        var a = void 0,
            p = void 0,
            s = void 0;
        s = 1.70158;
        p = 0;
        a = c;
        if (t === 0) {
            return b;
        } else if ((t /= d) === 1) {
            return b + c;
        }
        if (!p) {
            p = d * 0.3;
        }
        if (a < Math.abs(c)) {
            a = c;
            s = p / 4;
        } else {
            s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
    },
    'ease-in-out-elastic': function easeInOutElastic(t, b, c, d) {
        var a = void 0,
            p = void 0,
            s = void 0;
        s = 1.70158;
        p = 0;
        a = c;
        if (t === 0) {
            return b;
        } else if ((t /= d / 2) === 2) {
            return b + c;
        }
        if (!p) {
            p = d * (0.3 * 1.5);
        }
        if (a < Math.abs(c)) {
            a = c;
            s = p / 4;
        } else {
            s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        if (t < 1) {
            return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        }
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
    },
    'ease-in-back': function easeInBack(t, b, c, d, s) {
        if (s === void 0) {
            s = 1.70158;
        }
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    'ease-out-back': function easeOutBack(t, b, c, d, s) {
        if (s === void 0) {
            s = 1.70158;
        }
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    'ease-in-out-back': function easeInOutBack(t, b, c, d, s) {
        if (s === void 0) {
            s = 1.70158;
        }
        if ((t /= d / 2) < 1) {
            return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
        }
        return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
    },
    'ease-in-bounce': function easeInBounce(t, b, c, d) {
        var v = easingFunctions['ease-out-bounce'](d - t, 0, c, d);
        return c - v + b;
    },
    'ease-out-bounce': function easeOutBounce(t, b, c, d) {
        if ((t /= d) < 1 / 2.75) {
            return c * (7.5625 * t * t) + b;
        } else if (t < 2 / 2.75) {
            return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
        } else if (t < 2.5 / 2.75) {
            return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
        }
        return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
    },
    'ease-in-out-bounce': function easeInOutBounce(t, b, c, d) {
        if (t < d / 2) {
            var _v = easingFunctions['ease-in-bounce'](t * 2, 0, c, d);
            return _v * 0.5 + b;
        }
        var v = easingFunctions['ease-out-bounce'](t * 2 - d, 0, c, d);
        return v * 0.5 + c * 0.5 + b;
    }
};

/**
 * Create shortcut for default easing functions
 */
easingFunctions['ease-in'] = easingFunctions['ease-in-sine'];
easingFunctions['ease-out'] = easingFunctions['ease-out-sine'];
easingFunctions['ease-in-out'] = easingFunctions['ease-in-out-sine'];

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

var _queue = require('./queue');

var _queue2 = _interopRequireDefault(_queue);

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
        this.events = Object.create(null);
        this.queue = new _queue2.default();
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
         * Called when an animation is compeleted
         *
         * @api private
         */

    }, {
        key: 'complete',
        value: function complete() {
            if (this.isAnimating()) {
                this.animating = false;
                this.resolve();
                this.emit('done');
                this.promise = this.resolve = null;
                if (!this.queue.isEmpty()) {
                    this.animate.apply(this, this.queue.dequeue());
                }
            }
        }

        /**
         * Animate the element
         *
         * @param {Object} props
         * @param {Number} duration (optional)
         * @param {String} easing (optional)
         * @param {...Function} callbacks (optional)
         * @param {Promise}
         * @return {FX}
         * @api public
         */

    }, {
        key: 'animate',
        value: function animate(props) {
            var _this = this;

            var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultDuration;
            var easing = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultEasing;

            for (var _len = arguments.length, callbacks = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
                callbacks[_key - 3] = arguments[_key];
            }

            if (this.isAnimating()) {
                this.queue.enqueue([props, duration, easing].concat(callbacks));
                return this;
            }
            this.animating = true;
            this.emit('start');
            this.promise = new Promise(function (resolve) {
                _this.resolve = resolve;
                var el = _this.el;
                var frame = Object.create(null);
                var easingFunction = _easing2.default[easing];
                var startTime = void 0,
                    currentTime = void 0,
                    startProps = void 0,
                    endProps = void 0,
                    units = void 0;
                var tick = function tick(timestamp) {
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
                        (0, _props.setProperties)(el, frame, units);
                        requestAnimationFrame(tick);
                        _this.emit('tick', Math.round(currentTime / duration * 100), frame);
                    } else {
                        (0, _props.setProperties)(el, endProps, units);
                        _this.emit('tick', 100, endProps);
                        _this.complete();
                    }
                };
                requestAnimationFrame(function () {
                    var _getProperties = (0, _props.getProperties)(el, props);

                    var _getProperties2 = _slicedToArray(_getProperties, 3);

                    startProps = _getProperties2[0];
                    endProps = _getProperties2[1];
                    units = _getProperties2[2];

                    requestAnimationFrame(tick);
                });
            });
            callbacks.forEach(function (fn) {
                return _this.promise.then(fn);
            });
            return this;
        }

        /**
         * Add a callback function for when
         * the current animation is completed
         *
         * @param {Function} fn
         * @return {FX}
         * @api public
         */

    }, {
        key: 'then',
        value: function then(fn) {
            if (!this.queue.isEmpty()) {
                this.queue.getLast().push(fn);
            } else if (this.promise) {
                this.promise.then(fn);
            }
            return this;
        }

        /**
         * Add a callback function to a
         * custom event
         *
         * @param {String} name
         * @param {Function} fn
         * @return {FX}
         * @api public
         */

    }, {
        key: 'on',
        value: function on(name, fn) {
            if (!(name in this.events)) {
                this.events[name] = [];
            }
            this.events[name].push(fn);
            return this;
        }

        /**
         * Emit a custom event
         *
         * @param {String} name
         * @param {...*} args
         * @api private
         */

    }, {
        key: 'emit',
        value: function emit(name) {
            for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = arguments[_key2];
            }

            var callbacks = this.events[name];
            if (callbacks && callbacks.length) {
                callbacks.forEach(function (callback) {
                    return callback.apply(undefined, args);
                });
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

},{"./easing":1,"./props":3,"./queue":4,"./util":5}],3:[function(require,module,exports){
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
var valueRe = /([\+\-]?[0-9|auto\.]+)(%|\w+)?/;
var hex6Re = /^#?(\w{2})(\w{2})(\w{2})$/;
var hex3Re = /^#?(\w{1})(\w{1})(\w{1})$/;
var rgbRe = /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/;
var colorCache = Object.create(null);

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

/**
 * Get the value and units of a
 * CSS property
 *
 * @param {String} style
 * @return {Array}
 * @api private
 */
function getValue(style) {
    var match = valueRe.exec(style);
    return [parseFloat(match[1]) || 0, match[2] || 'px'];
}

/**
 * Determine the start point for
 * the element
 *
 * @param {Element} el
 * @param {String} prop
 * @param {String} end
 * @param {String} units
 * @return {Number}
 */
function getStartValue(el, prop, end, units) {
    var start = parseFloat(getStyle(el, prop)) || 0;
    if (units !== 'px') {
        setStyle(el, prop, (end || 1) + units);
        start = (end || 1) / parseFloat(getStyle(el, prop)) * start;
        setStyle(el, prop, start + units);
    }
    return start;
}

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
 * Set the value of an element's
 * style property
 *
 * @param {Element} el
 * @param {String} prop
 * @param {String} value
 * @api private
 */
function setStyle(el, prop, value) {
    el.style[prop] = value;
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
    var units = Object.create(null);
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
                startProps[prop] = parseColor(from);
                endProps[prop] = parseColor(to);
            } else if (prop === 'scrollTop' || prop === 'scrollLeft') {
                from = from == null ? el[prop] : from;
                startProps[prop] = from;
                endProps[prop] = to;
            } else if (prop in el.style) {
                var _getValue = getValue(to);

                var _getValue2 = _slicedToArray(_getValue, 2);

                var _value = _getValue2[0];
                var unit = _getValue2[1];

                from = from == null ? getStartValue(el, prop, _value, unit) : getValue(from)[0];
                startProps[prop] = from;
                endProps[prop] = _value;
                units[prop] = unit;
            } else {
                startProps[prop] = from;
                endProps[prop] = to;
            }
        }
    }
    return [startProps, endProps, units];
}

/**
 * Set multiple style properties for
 * an element
 *
 * @param {Element} el
 * @param {Object} props
 * @param {Object} units
 * @api private
 */
function setProperties(el, props, units) {
    var prop = void 0,
        value = void 0;
    for (prop in props) {
        value = props[prop];
        switch (prop) {
            case 'opacity':
                setStyle(el, prop, value);
                break;
            case 'scrollTop':
            case 'scrollLeft':
                el[prop] = value;
                break;
            default:
                if (prop in el.style) {
                    if ((0, _util.includes)(prop, 'color')) {
                        setStyle(el, prop, 'rgb(\n                            ' + Math.floor(value[0]) + ', \n                            ' + Math.floor(value[1]) + ', \n                            ' + Math.floor(value[2]) + '\n                        )');
                    } else {
                        var unit = units[prop];
                        setStyle(el, prop, value + unit);
                    }
                }
        }
    }
}

},{"./util":5}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Control a sequence of objects
 *
 * @class Queue
 * @api private
 */
var Queue = function () {

    /**
     * Create a new `Queue` instance
     *
     * @constructor
     * @api public
     */
    function Queue() {
        _classCallCheck(this, Queue);

        this.items = [];
    }

    /**
     * Add an object to the end of
     * the queue
     *
     * @param {*} item
     * @api public
     */


    _createClass(Queue, [{
        key: "enqueue",
        value: function enqueue(item) {
            this.items.push(item);
        }

        /**
         * Remove and return the first
         * object in the queue, return
         * null if none exist
         *
         * @return {*|Null}
         * @api public
         */

    }, {
        key: "dequeue",
        value: function dequeue() {
            return this.items.shift() || null;
        }

        /**
         * Return the last item in the
         * queue or null if none exist
         *
         * @return {*|Null}
         * @api public
         */

    }, {
        key: "getLast",
        value: function getLast() {
            return this.items[this.items.length - 1] || null;
        }

        /**
         * Clear the queue
         *
         * @api public
         */

    }, {
        key: "clear",
        value: function clear() {
            this.items = [];
        }

        /**
         * Is the queue empty?
         *
         * @return {Boolean}
         * @api public
         */

    }, {
        key: "isEmpty",
        value: function isEmpty() {
            return this.items.length === 0;
        }
    }]);

    return Queue;
}();

exports.default = Queue;
module.exports = exports["default"];

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isArray = isArray;
exports.includes = includes;
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

},{}]},{},[2])(2)
});

