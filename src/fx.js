/**
 * Import dependencies
 */
import Queue from './queue';
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
        this.queue = new Queue();
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
     * Called when an animation is compeleted
     *
     * @api private
     */
    complete() {
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
    animate(props, duration = defaultDuration, easing = defaultEasing, ...callbacks) {
        if (this.isAnimating()) {
            this.queue.enqueue([props, duration, easing, ...callbacks]);
            return this;
        }
        this.animating = true;
        this.emit('start');
        this.promise = new Promise((resolve) => {
            this.resolve = resolve;
            const el = this.el;
            const frame = Object.create(null);
            const easingFunction = easingFunctions[easing];
            let startTime, currentTime, startProps, endProps, units;
            const tick = (timestamp) => {
                if (!startTime) {
                    startTime = timestamp;
                }
                if (this.isAnimating() && (timestamp < startTime + duration)) {
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
                    setProperties(el, frame, units);
                    requestAnimationFrame(tick);
                    this.emit('tick', Math.round((currentTime / duration) * 100), frame);
                } else {
                    setProperties(el, endProps, units);
                    this.emit('tick', 100, endProps);
                    this.complete();
                }
            };
            requestAnimationFrame(() => {
                [startProps, endProps, units] = getProperties(el, props);
                requestAnimationFrame(tick);
            });
        });
        callbacks.forEach((fn) => this.promise.then(fn));
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
    then(fn) {
        if (!this.queue.isEmpty()) {
            this.queue.getLast().push(fn);
        } else if (this.promise) {
            this.promise.then(fn);
        }
        return this;
    }

    /**
     * Stop the current animation
     *
     * @return {FX}
     * @api public
     */
    stop() {
        if (this.isAnimating()) {
            this.animating = false;
        }
        return this;
    }

    /**
     * Clear the animation queue
     *
     * @return {FX}
     * @api public
     */
    clear() {
        if (!this.queue.isEmpty()) {
            this.queue.clear();
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
    on(name, fn) {
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
