/**
 * Import dependencies
 */
import easingFunctions from './easing';
import { getProperties, setProperties } from './props';
import { isArray } from './util';

/**
 * Default animation options
 */
const defaultDuration = 700;
const defaultEasing = 'ease-out';

/**
 * Animation class
 *
 * @class FX
 * @api public
 */
class FX {

    /**
     * Instantiate the class providing a
     * CSS selector string or DOM element
     * to be animated
     *
     * @constructor
     * @param {Element|String} el
     * @api private
     */
    constructor(el) {
        this.el = typeof el === 'string' ? document.querySelector(el) : el;
        this.events = Object.create(null);
        this.animating = false;
    }

    /**
     * Get the animation element
     *
     * @return {Element}
     * @api public
     */
    getElement() {
        return this.el;
    }

    /**
     * Is the animation element currently
     * animating
     *
     * @return {Boolean}
     * @api public
     */
    isAnimating() {
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
    animate(props, duration = defaultDuration, easing = defaultEasing) {
        this.animating = true;
        this.emit('start');
        return new Promise((resolve) => {
            const el = this.el;
            const frame = Object.create(null);
            const easingFunction = easingFunctions[easing];
            let startTime, currentTime, startProps, endProps;
            const tick = (timestamp) => {
                if (!startTime) {
                    startTime = timestamp;
                }
                if (timestamp < startTime + duration) {
                    currentTime = timestamp - startTime;
                    let start, end, prop, i, len;
                    for (prop in startProps) {
                        start = startProps[prop];
                        end = endProps[prop];
                        if (isArray(start)) {
                            frame[prop] = [];
                            for (i = 0, len = start.length; i < len; i++) {
                                frame[prop][i] = easingFunction(
                                    currentTime,
                                    start[i],
                                    end[i] - start[i],
                                    duration
                                );
                            }
                        } else {
                            frame[prop] = easingFunction(
                                currentTime,
                                start,
                                end - start,
                                duration
                            );
                        }
                    }
                    setProperties(el, frame);
                    requestAnimationFrame(tick);
                    this.emit('tick', Math.round((currentTime / duration) * 100), frame);
                } else {
                    setProperties(el, endProps);
                    this.animating = false;
                    resolve();
                    this.emit('done');
                }
            };
            requestAnimationFrame(() => {
                [startProps, endProps] = getProperties(el, props);
                requestAnimationFrame(tick);
            });
        });
    }

    /**
     * Add a callback function to a
     * custom event
     *
     * @param {String} name
     * @param {Function} fn
     * @api public
     */
    on(name, fn) {
        if (!(name in this.events)) {
            this.events[name] = [];
        }
        this.events[name].push(fn);
    }

    /**
     * Emit a custom event
     *
     * @param {String} name
     * @param {...*} args
     * @api private
     */
    emit(name, ...args) {
        const callbacks = this.events[name];
        if (callbacks && callbacks.length) {
            callbacks.forEach((callback) => callback(...args));
        }
    }
}

/**
 * Factory function for creating
 * `FX` instances
 *
 * @param {Element|String} tpl
 * @return {FX}
 * @api public
 */
export default function fx(el) {
    return new FX(el);
}
